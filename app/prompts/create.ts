export const createPrompt = (text: string): string =>
  `命令：イベント後のアンケートのフォームに含めるべきコンテンツを出力してください。
入力内容：イベントの概要。
出力形式：必ず次の JSON 形式で出力してください。

[
  {
    "id": "question1",
    "type": "text",
    "text": {
      "ja": "イベントの中で楽しかったポイントはなんですか？",
      "en": "What were the enjoyable points of the event?"
    },
    "required": true,
    "placeholder": {
      "ja": "具体的なエピソードをお聞かせください",
      "en": "Please share specific experiences"
    }
  },
  {
    "id": "question2",
    "type": "radio",
    "text": {
      "ja": "満足度は、1 〜 5 段階の評価だといくつでしたか？",
      "en": "How satisfied were you on a scale of 1 to 5?"
    },
    "required": true,
    "choices": [
      {
        "value": "1",
        "label": {
          "ja": "1 : 全く満足できなかった",
          "en": "1 : Not satisfied at all"
        }
      },
      {
        "value": "2",
        "label": {
          "ja": "2 : あまり満足できなかった",
          "en": "2 : Slightly dissatisfied"
        }
      },
      {
        "value": "3",
        "label": {
          "ja": "3 : どちらでもない",
          "en": "3 : Neutral"
        }
      },
      {
        "value": "4",
        "label": {
          "ja": "4 : まあまあ満足した",
          "en": "4 : Somewhat satisfied"
        }
      },
      {
        "value": "5",
        "label": {
          "ja": "5 : とても満足した",
          "en": "5 : Very satisfied"
        }
      }
    ]
  },
  {
    "id": "question3",
    "type": "checkbox",
    "text": {
      "ja": "興味のあるトピックを選んでください（複数選択可）",
      "en": "Please select the topics you're interested in (multiple choices allowed)"
    },
    "required": false,
    "choices": [
      {
        "value": "tech",
        "label": {
          "ja": "テクノロジー",
          "en": "Technology"
        }
      },
      {
        "value": "art",
        "label": {
          "ja": "アート",
          "en": "Art"
        }
      },
      {
        "value": "sports",
        "label": {
          "ja": "スポーツ",
          "en": "Sports"
        }
      },
      {
        "value": "music",
        "label": {
          "ja": "音楽",
          "en": "Music"
        }
      }
    ]
  }
]

制約：
・質問の数は３つにし、それぞれの type は text, radio, checkbox で生成してください。

入力：
${text}`;
