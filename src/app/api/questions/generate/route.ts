import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const TOPIC_PROMPTS: Record<string, string> = {
  "subject-verb-agreement":
    "Subject-Verb Agreement: kesesuaian subjek dan kata kerja termasuk singular/plural, intervening phrases, collective nouns, indefinite pronouns.",
  "clause-vs-phrase":
    "Clause vs Phrase: membedakan independent/dependent clause dengan noun phrase, prepositional phrase, dan jenis frase lainnya.",
  subjunctive:
    "Subjunctive: penggunaan bentuk kata kerja subjunctive setelah kata kerja saran (suggest, recommend, demand), wish, serta kalimat kondisi hypothetical.",
  conditional:
    "Conditional Sentences: type 0 (general truth), type 1 (real/present), type 2 (unreal present), type 3 (unreal past), dan mixed conditionals.",
  inversion:
    "Inversion: pembalikan S-V setelah negative adverb (never, rarely, seldom), prepositional phrases, conditional inversion (had I known), dan emphasis.",
  "parallel-structure":
    "Parallel Structure: konsistensi bentuk gramatikal dalam correlative conjunctions (both...and, not only...but also), comparisons, dan lists.",
  "relative-clause":
    "Relative Clause: penggunaan who, whom, whose, which, that, where, when, why; restrictive vs non-restrictive; reducing relative clauses.",
  "gerund-vs-infinitive":
    "Gerund vs Infinitive: kapan menggunakan gerund (enjoy, avoid, finish) vs infinitive (want, decide, hope); kata kerja yang bisa keduanya dengan makna berbeda.",
  "reduced-clause":
    "Reduced Clause: menyederhanakan adjective clause (V-ing, V-ed, to V) dan adverb clause menjadi frase yang lebih ringkas.",
  modifier:
    "Modifier: penempatan modifier yang benar, dangling modifier, squinting modifier, misplaced modifier, dan limiting modifier.",
};

function buildSystemPrompt(topicId: string): string {
  if (topicId === "random") {
    return `You are an expert TOEFL EPT grammar question generator. Generate high-quality multiple choice grammar questions covering various TOEFL grammar topics. Topics include: Subject-Verb Agreement, Clause vs Phrase, Subjunctive, Conditional, Inversion, Parallel Structure, Relative Clause, Gerund vs Infinitive, Reduced Clause, and Modifier. Mix topics randomly for each question.`;
  }

  const topicDesc =
    TOPIC_PROMPTS[topicId] || "TOEFL grammar";
  return `You are an expert TOEFL EPT grammar question generator specializing in ${topicDesc}. Generate high-quality, exam-level multiple choice questions that test understanding of this specific grammar topic. Focus on common TOEFL patterns and traps.`;
}

function buildUserPrompt(topicId: string, count: number): string {
  return `Generate exactly ${count} TOEFL EPT grammar multiple choice questions.

IMPORTANT RULES:
1. Each question MUST have exactly 5 options (A, B, C, D, E)
2. The correct answer must be distributed across all positions (A through E), not clustered in one position
3. Each question must be a complete sentence with a blank or underline showing what needs to be identified/corrected
4. Questions should be at TOEFL EPT difficulty level
5. Provide clear, educational explanations for why the correct answer is right

RESPOND ONLY WITH VALID JSON in this exact format:
{
  "questions": [
    {
      "id": "q1",
      "question": "The question text with _____ or underlined part",
      "options": {
        "a": "Option A text",
        "b": "Option B text",
        "c": "Option C text",
        "d": "Option D text",
        "e": "Option E text"
      },
      "correctAnswer": "b",
      "explanation": "Detailed explanation of why B is correct and why other options are wrong, referencing specific grammar rules"
    }
  ]
}

${topicId === "random" ? "Mix different grammar topics across the questions." : "All questions should be about this specific grammar topic."}

Do NOT include any text outside the JSON. Do NOT wrap in markdown code blocks.`;
}

function shuffleOptions(
  question: {
    id: string;
    question: string;
    options: { a: string; b: string; c: string; d: string; e: string };
    correctAnswer: string;
    explanation: string;
  },
  questionIndex: number
) {
  const keys = ["a", "b", "c", "d", "e"] as const;
  const rotationOffset = questionIndex % 5;

  const rotatedKeys = [
    ...keys.slice(rotationOffset),
    ...keys.slice(0, rotationOffset),
  ];
  const newOptions: { a: string; b: string; c: string; d: string; e: string } = {
    a: "",
    b: "",
    c: "",
    d: "",
    e: "",
  };

  for (let i = 0; i < 5; i++) {
    newOptions[rotatedKeys[i]] = question.options[keys[i]];
  }

  const oldCorrectIndex = keys.indexOf(question.correctAnswer as (typeof keys)[number]);
  const newCorrectKey = rotatedKeys[oldCorrectIndex];

  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectKey,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, count = 5 } = body;

    if (!topic || !count) {
      return NextResponse.json(
        { error: "Topic dan jumlah pertanyaan wajib diisi" },
        { status: 400 }
      );
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { error: "Jumlah pertanyaan harus antara 1 dan 20" },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
      return NextResponse.json(
        { error: "Groq API key belum dikonfigurasi" },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(topic);
    const userPrompt = buildUserPrompt(topic, count);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 8000,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", response.status, errorData);
      return NextResponse.json(
        {
          error: `Gagal menghasilkan pertanyaan: ${response.status}`,
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Respons kosong dari AI" },
        { status: 502 }
      );
    }

    let parsed;
    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleanContent);
    } catch {
      console.error("Failed to parse JSON response:", content);
      return NextResponse.json(
        { error: "Gagal memparse respons AI" },
        { status: 502 }
      );
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      return NextResponse.json(
        { error: "Format respons AI tidak valid" },
        { status: 502 }
      );
    }

    const validatedQuestions = parsed.questions
      .filter(
        (q: Record<string, unknown>) =>
          q.question &&
          q.options &&
          q.correctAnswer &&
          q.explanation
      )
      .map(
        (
          q: {
            id?: string;
            question: string;
            options: { a: string; b: string; c: string; d: string; e: string };
            correctAnswer: string;
            explanation: string;
          },
          index: number
        ) => {
          const ensured = {
            id: q.id || `q${index + 1}`,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer.toLowerCase(),
            explanation: q.explanation,
          };
          return shuffleOptions(ensured, index);
        }
      );

    return NextResponse.json({
      questions: validatedQuestions,
      count: validatedQuestions.length,
    });
  } catch (error) {
    console.error("Generate questions error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server internal" },
      { status: 500 }
    );
  }
}
