/* Parentfit Japanese Dictionary (日本語) */

export const ja = {
  // --- Header & Navigation ---
  header: {
    brand: "Parentfit",
    menu: "メニュー",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    settings: "設定"
  },
  navbar: {
    home: "ホーム",
    schedule: "スケジュール",
    exercises: "エクササイズ",
    progress: "進捗",
    nutrition: "栄養"
  },

  // --- Days of Week ---
  days: {
    Sunday: "日曜日",
    Monday: "月曜日",
    Tuesday: "火曜日",
    Wednesday: "水曜日",
    Thursday: "木曜日",
    Friday: "金曜日",
    Saturday: "土曜日"
  },

  // --- Home View ---
  home: {
    dailyCoach: "デイリーコーチ",
    goodMorning: "おはようございます、{name}さん！",
    goodAfternoon: "こんにちは、{name}さん！",
    goodEvening: "こんばんは、{name}さん！",
    subtitle: "今日も無理なく体を動かし、健康を大切にしましょう。",
    routineSuffix: "{day}のルーティン",
    exercisesCount: "{count}個のエクササイズ",
    startTodayWorkout: "▶️ 今日のワークアウトを始める",
    workoutStreak: "ワークアウト連続日数",
    workoutsCompleted: "完了したワークアウト",
    daysUnit: "{count}日",
    weightTracker: "体重トラッカー",
    currentWeight: "現在: {weight} kg",
    logWeightBtn: "+ 体重を記録",
    hydrationProgress: "水分補給の進捗",
    hydrationCount: "今日 8杯中 {count}杯 記録済み",
    viewTips: "ヒントを見る ›",
    quickShortcuts: "クイックショートカット",
    weeklySchedule: "週間スケジュール",
    exerciseLibrary: "エクササイズライブラリ",
    logWeightModalTitle: "今日の体重を記録",
    logWeightModalSub: "無理なく穏やかに体重を記録しましょう。",
    weightInputLabel: "体重 (kg):",
    saveWeightBtn: "体重を保存",
    validWeightAlert: "30 kg から 250 kg の間の有効な体重を入力してください。"
  },

  // --- Schedule View ---
  schedule: {
    title: "週間スケジュール",
    subtitle: "無理なく継続的な進捗のために設計された、穏やかでバランスの取れた7日間プラン。",
    todayTag: "今日",
    completedTag: "✓ 完了",
    startStretch: "🌱 優しいストレッチを始める",
    startWorkout: "▶️ ワークアウトを始める"
  },

  // --- Exercise Library & Details View ---
  details: {
    libraryTitle: "エクササイズライブラリ",
    librarySubtitle: "ステップごとの姿勢イラストと安全上のヒントを備えた、初心者向けの優しいエクササイズをご覧ください。",
    backLink: "← すべてのエクササイズに戻る",
    equipmentLabel: "器具:",
    musclesTargeted: "対象となる筋肉:",
    recommendedTraining: "おすすめトレーニング",
    yourNextTarget: "次の目標",
    sets: "セット",
    reps: "回数",
    duration: "時間",
    rest: "休憩",
    secUnit: "{sec}秒",
    basedOnRecentPerf: "最近のパフォーマンスに基づく",
    previous: "前回:",
    feedback: "フィードバック:",
    instructionsTitle: "ステップバイステップの手順:",
    mistakesTitle: "⚠️ 避けるべき一般的な間違い:",
    breathingTitle: "🌬️ 正しい呼吸法:",
    practiceBtn: "▶ 今すぐこのエクササイズを練習する"
  },

  // --- Workout Player View ---
  player: {
    exit: "✕ 終了",
    exerciseOf: "エクササイズ {current} / {total}",
    restTime: "休憩時間",
    restAdvice: "深呼吸をして水分を補給しましょう 💧",
    add10Sec: "+10秒",
    skipRest: "休憩をスキップ ⏭️",
    targetSet: "目標セット",
    setOf: "セット {current} / {total}",
    repetitions: "回数",
    duration: "時間",
    howToPerform: "やり方:",
    breathingTip: "🌬️ 呼吸のアドバイス:",
    prevBtn: "◀ 前へ",
    setCompleteBtn: "セット {nextSet} 完了 ✓",
    nextExerciseBtn: "次のエクササイズ ▶",
    finishWorkoutBtn: "ワークアウトを終了 🎉",
    workoutCompleteTitle: "ワークアウト完了！",
    workoutCompleteSub: "素晴らしいです！今日、あなたの筋力、心臓、健康のために素晴らしい一歩を踏み出しました。",
    currentActiveStreak: "現在の連続日数",
    backToHomeBtn: "ホームに戻る ❤️",
    feedbackModalTitle: "このエクササイズはどう感じましたか？",
    feedbackModalPrompt: "{name} のフィードバックを選択してください:",
    easyRating: "🙂 簡単",
    goodRating: "👍 ちょうど良い",
    difficultRating: "😓 きつい",
    tooDifficultRating: "🛑 きつすぎる"
  },

  // --- Ratings Display ---
  ratings: {
    easy: "簡単",
    good: "ちょうど良い",
    difficult: "きつい",
    too_difficult: "きつすぎる"
  },

  // --- Progress View ---
  progress: {
    title: "あなたの健康の進捗",
    subtitle: "フィットネスの旅のすべてのステップを祝い、継続性を記録しましょう。",
    activeStreak: "連続日数",
    totalWorkouts: "総ワークアウト数",
    weightTracker: "体重トラッカー",
    currentWeight: "現在: {weight} kg",
    logWeightBtn: "+ 体重を記録",
    recentLogHeader: "最近の体重記録 (kg)",
    completedHistory: "完了したワークアウトの履歴",
    noWorkoutsYet: "まだワークアウトが記録されていません。",
    startFirstSession: "今日から最初の優しいセッションを始めて、連続記録を開始しましょう！",
    viewScheduleBtn: "週間スケジュールを見る",
    completedTag: "✓ 完了",
    minUnit: "{min}分"
  },

  // --- Nutrition View ---
  nutrition: {
    title: "栄養と水分補給",
    subtitle: "シンプルで体に優しい食事と毎日の水分補給ガイドで体を養いましょう。",
    waterTrackerTitle: "毎日の水分トラッカー",
    waterGoal: "目標: {goal}杯 (2リットル)",
    removeCup: "- 1杯減らす",
    drinkCup: "+ 1杯飲む 🥛",
    vitalGuidance: "重要な健康ガイド",
    wholesomeMealIdeas: "体に優しい食事アイデア"
  },

  // --- Settings View ---
  settings: {
    title: "アプリ設定",
    subtitle: "快適さと見やすさのために Parentfit の体験をカスタマイズしましょう。",
    displayAccess: "画面とアクセシビリティ",
    darkTheme: "ダークテーマ",
    darkThemeSub: "暗い場所でも目に優しい",
    audioBeeps: "音声ガイダンス音",
    audioSub: "タイマー音と達成音",
    textSizeLabel: "文字の大きさ:",
    sizeNormal: "標準サイズ",
    sizeLarge: "大 (シニア向け - おすすめ)",
    sizeXLarge: "特大文字",
    languageLabel: "言語:",
    languageEnglish: "English",
    languageHindi: "हिंदी",
    languageJapanese: "日本語",
    userProfile: "ユーザープロフィール",
    yourName: "お名前:",
    targetWeight: "目標体重 (kg):",
    saveProfileBtn: "プロフィール変更を保存",
    appStorage: "アプリとストレージ",
    installPwaBtn: "📲 ホーム画面に Parentfit をインストール",
    pwaReadyMsg: "✓ Parentfit はオフラインで使用できます！",
    resetDataTitle: "アプリデータをリセット",
    resetDataSub: "ワークアウト履歴、体重記録を消去し、設定をリセットします。",
    resetDataBtn: "⚠️ すべてのローカルデータをリセット",
    resetModalTitle: "リセットの確認",
    resetModalBody: "すべてのワークアウト記録と設定を消去してもよろしいですか？この操作は取り消せません。",
    resetModalPrimary: "はい、すべてリセットします",
    profileSavedAlert: "プロフィールが正常に保存されました！ ❤️",
    onStatus: "☀️ オン",
    offStatus: "🌙 オフ",
    soundOnStatus: "🔊 オン",
    soundOffStatus: "🔇 オフ"
  },

  // --- About View ---
  about: {
    title: "Parentfit",
    subtitle: "あなたの体に優しいパーソナルフィットネスコーチ",
    version: "バージョン 1.0 (PWA オフライン対応)",
    missionTitle: "お母さんへの愛を込めてデザイン",
    missionBody: "Parentfit は、激しいジムの負担なしに、アクティブに過ごし、筋力をつけ、関節の健康を守り、毎日元気に過ごしたい女性やシニアの方々のために特別に作られました。",
    safetyTitle: "健康と安全に関するご注意",
    safetyBody: "常に自分の体の声に耳を傾けてください！エクササイズは快適で優しく感じられる必要があります。めまい、鋭い関節の痛み、息切れを感じた場合は、すぐに中止して休んでください。新しいフィットネスルーティンを始める前に、医師にご相談ください。",
    goldenRulesTitle: "成功のためのゴールデンルール",
    rule1Title: "強度よりも継続:",
    rule1Text: " 月に1回疲労困憊するワークアウトをするよりも、毎日10分間の優しい散歩やストレッチをする方が効果的です。",
    rule2Title: "安定した呼吸:",
    rule2Text: " エクササイズ中に息を止めないでください。鼻から吸って口から吐きます。",
    rule3Title: "水分補給:",
    rule3Text: " 毎回のワークアウトセッションの前後に新鮮な水をコップ1杯飲みましょう。",
    footerText: "Parentfit プログレッシブウェブアプリ • 100% オフラインで動作"
  },

  // --- Schedule Plans & Focus Translations ---
  plans: {
    "Gentle Full Body Starter": "優しめ全身スターター",
    "Active Walk & Stretch": "アクティブウォーク＆ストレッチ",
    "Lower Body & Stability": "下半身＆安定性",
    "Gentle Recovery Stretch": "優しいリカバラストレッチ",
    "Upper Body & Posture": "上半身＆姿勢",
    "Weekend Total Body": "週末トータルボディ",
    "Rest & Recharge": "休息＆リフレッシュ",
    "Full Body": "全身",
    "Cardio & Flexibility": "有酸素＆柔軟性",
    "Legs & Balance": "脚＆バランス",
    "Mobility & Relief": "可動性＆リラックス",
    "Arms, Back & Shoulders": "腕・背中・肩",
    "Strength & Endurance": "筋力＆持久力",
    "Rest & Hydration": "休息＆水分補給",
    "Gentle": "優しい",
    "Light": "軽め",
    "Very Light": "かなり軽め",
    "Moderate": "中程度",
    "Rest": "休息"
  },

  // --- Exercises Data Translations ---
  exercises: {
    "chair-squat": {
      name: "チェアー・スクワット",
      difficulty: "初心者向け",
      equipment: "頑丈な椅子",
      muscles: ["大腿四頭筋", "臀筋", "体幹"],
      instructions: [
        "頑丈な椅子の前に立ち、足を腰幅に開きます。",
        "椅子に座るように、ゆっくりとヒップを後ろと下に引きます。",
        "勢いよく落ちないように、臀筋で座面に軽く触れます。",
        "かかとで床を押して、真っ直ぐ立ち上がります。"
      ],
      mistakes: [
        "膝が内側に入ってしまう",
        "前傾姿勢になりすぎる",
        "椅子にドスンと座り込む"
      ],
      breathing: "座るときに息を吸い、立ち上がるときに息を吐きます。"
    },
    "goblet-squat": {
      name: "ゴブレット・スクワット",
      difficulty: "中級者向け",
      equipment: "軽いダンベルまたはペットボトル",
      muscles: ["大腿四頭筋", "臀筋", "ハムストリングス", "体幹"],
      instructions: [
        "両手で軽いダンベルやペットボトルを持ち、胸の近くで保持します。",
        "足を腰幅より少し広めに開き、つま先を少し外側に向けます。",
        "胸を張った姿勢を保ちながら、膝を曲げて腰を落とします。",
        "太ももが床と平行になるか、無理のない高さまで下げます。",
        "かかとで床を押して立ち上がります。"
      ],
      mistakes: [
        "背中の上部が丸まる",
        "かかとが床から浮いてしまう",
        "重りを胸から離して持ってしまう"
      ],
      breathing: "しゃがむときに息を吸い、立ち上がるときにしっかり息を吐きます。"
    },
    "shoulder-press": {
      name: "ショルダー・プレス",
      difficulty: "初心者向け",
      equipment: "椅子と軽い重り（またはペットボトル）",
      muscles: ["肩", "上腕三頭筋", "背中上部"],
      instructions: [
        "両足を床につけて椅子に背筋を伸ばして座り、お腹に力を入れます。",
        "肘を曲げて手のひらを前に向け、肩の高さで重りを持ちます。",
        "腕がほぼ真っ直ぐになるまで、重りを頭上へスムーズに持ち上げます。",
        "頂点で一瞬止め、コントロールしながら肩の高さまで戻します。"
      ],
      mistakes: [
        "腰を後ろに反らせすぎる",
        "頂点で肘を強くロックしてしまう",
        "肩を耳に近づけるようにすくめる"
      ],
      breathing: "押し上げるときに息を吐き、重りを下げるときに息を吸います。"
    },
    "bent-over-row": {
      name: "ベントオーバー・ロー",
      difficulty: "初心者向け",
      equipment: "軽いダンベルまたはペットボトル",
      muscles: ["背中上部", "上腕二頭筋", "姿勢筋"],
      instructions: [
        "膝を軽く曲げて立ち、背筋を伸ばしたまま股関節から前傾します。",
        "手のひらを向かい合わせにし、重りを床に向かって垂らします。",
        "肘を腰に向かって引き上げ、肩甲骨を寄せます。",
        "背中を丸めずに、コントロールしながら重りをゆっくり下げます。"
      ],
      mistakes: [
        "背骨を丸めてしまう",
        "反動を使って勢いよく引き上げる",
        "真上を見て首に負担をかける"
      ],
      breathing: "重りを引き上げるときに息を吐き、下げるときに息を吸います。"
    },
    "biceps-curl": {
      name: "バイセップス・カール",
      difficulty: "初心者向け",
      equipment: "軽い重りまたはペットボトル",
      muscles: ["上腕二頭筋", "前腕"],
      instructions: [
        "背筋を伸ばして立つか椅子に座り、体に沿って重りを持ちます。",
        "肘を体側にしっかり寄せます。",
        "肘を曲げ、重りを肩に向かって引き上げます。",
        "頂点で上腕二頭筋を意識し、ゆっくりと元に戻します。"
      ],
      mistakes: [
        "体を前後に揺らす",
        "肘が体から離れて開く",
        "コントロールせずに急に重りを落とす"
      ],
      breathing: "引き上げるときに息を吐き、下げるときに息を吸います。"
    },
    "triceps-extension": {
      name: "トライセップス・エクステンション",
      difficulty: "初心者向け",
      equipment: "椅子と軽いダンベル（またはペットボトル）1本",
      muscles: ["上腕三頭筋", "二の腕の引き締め"],
      instructions: [
        "両足を床に平らにつけて、椅子に真っ直ぐ座ります。",
        "両手で1つの重りを頭の上に持ち、肘を前に向けます。",
        "ゆっくり肘を曲げて、重りを頭の後ろへ下げます。",
        "腕を頭上へ伸ばし、二の腕の後ろ側を意識します。"
      ],
      mistakes: [
        "肘が外側に開いてしまう",
        "腰を過剰に反らせる",
        "上腕が前後に動いてしまう"
      ],
      breathing: "頭の後ろに下げるときに息を吸い、頭上に伸ばすときに息を吐きます。"
    },
    "glute-bridge": {
      name: "ヒップブリッジ",
      difficulty: "初心者向け",
      equipment: "ヨガマットまたは柔らかいじゅうたん",
      muscles: ["臀筋", "ハムストリングス", "腰部", "体幹"],
      instructions: [
        "膝を曲げ、足を腰幅に開いて床につけ、仰向けに寝ます。",
        "手のひらを下にして両腕を体側に置きます。",
        "かかとで床を押し、お尻をしめてヒップを天井に向かって持ち上げます。",
        "膝から肩までが直線になるようにし、1〜2秒キープしてから下げます。"
      ],
      mistakes: [
        "頂点で腰を反らせすぎる",
        "かかとではなくつま先で押してしまう",
        "お尻を意識せずに焦って動作を行う"
      ],
      breathing: "ヒップを持ち上げるときに息を吐き、ゆっくり下げるときに息を吸います。"
    },
    "standing-calf-raise": {
      name: "スタンディング・カーフレイズ",
      difficulty: "初心者向け",
      equipment: "壁または椅子の背もたれ",
      muscles: ["ふくらはぎ", "足首の安定性", "バランス"],
      instructions: [
        "足を腰幅に開き、バランスを取るために壁や椅子の背もたれを掴んで立ちます。",
        "足の指の付け根で床を押し、かかとを高く持ち上げます。",
        "頂点で一瞬止め、ふくらはぎの収縮を感じます。",
        "コントロールしながらゆっくりかかとを床に戻します。"
      ],
      mistakes: [
        "持ち上げるときに膝を曲げてしまう",
        "椅子に強く寄りかかりすぎる",
        "下で跳ねるように急動作する"
      ],
      breathing: "つま立ちになるときに息を吐き、かかとを下げるときに息を吸います。"
    },
    "farmer-carry": {
      name: "ファーマーズ・キャリー",
      difficulty: "初心者向け",
      equipment: "買い物袋2つまたはダンベル",
      muscles: ["握力", "体幹", "肩", "姿勢"],
      instructions: [
        "両手に軽い重りや水を入れたペットボトル/袋を持ちます。",
        "背筋を伸ばし、肩を下げて後ろに引き、お腹を意識します。",
        "ゆっくりとコントロールされた歩幅で前へ歩きます。",
        "体を傾けずに真っ直ぐな姿勢を維持します。"
      ],
      mistakes: [
        "肩が前かがみになる",
        "重りが左右に揺れる",
        "歩く速度が早すぎる、または歩幅が不揃い"
      ],
      breathing: "歩いている間、鼻から深呼吸を続けます。"
    },
    "wall-push-up": {
      name: "ウォール・プッシュアップ",
      difficulty: "初心者向け",
      equipment: "壁",
      muscles: ["胸", "肩", "上腕三頭筋", "体幹"],
      instructions: [
        "壁に向かって腕1本分離れて立ち、足を肩幅に開きます。",
        "手のひらを肩の高さ・肩幅で壁に平らにつけます。",
        "体を真っ直ぐ保ったまま、ゆっくり肘を曲げて胸を壁に近づけます。",
        "壁をしっかり押して、元の姿勢に戻ります。"
      ],
      mistakes: [
        "腰が前に落ちてしまう",
        "肘が肩より高く開いてしまう",
        "肘ではなく首だけ曲げてしまう"
      ],
      breathing: "壁に近づくときに息を吸い、押して戻すときに息を吐きます。"
    },
    "stretching": {
      name: "全身ストレッチ",
      difficulty: "初心者向け",
      equipment: "マットまたは椅子",
      muscles: ["全身", "柔軟性", "関節の可動性"],
      instructions: [
        "両腕を天井に向かって優しく伸ばし、背骨をストレッチします。",
        "腕を下ろし、胸の前でクロスさせて肩を伸ばします。",
        "首の緊張をほぐすため、頭を左右に優しく傾けます。",
        "左右への優しい体側伸ばしで仕上げます。"
      ],
      mistakes: [
        "ストレッチ中に反動をつける",
        "息を止める",
        "痛みを感じるまで強く伸ばす"
      ],
      breathing: "鼻から深く息を吸い、口からゆっくり吐き出します。"
    },
    "walking": {
      name: "マインドフル・ウォーキング",
      difficulty: "初心者向け",
      equipment: "歩きやすい靴",
      muscles: ["心臓の健康", "脚", "持久力", "気分転換"],
      instructions: [
        "歩きやすい靴を履き、肩の力を抜いて真っ直ぐ立ちます。",
        "会話ができる程度の楽でやや速いペースで歩きます。",
        "歩幅に合わせて腕を自然に振ります。",
        "最後の2分間はゆっくり歩いてクールダウンします。"
      ],
      mistakes: [
        "前を見ずに足元ばかり見る",
        "大股になりすぎる",
        "肩を耳に向かってすくめる"
      ],
      breathing: "歩くリズムに合わせて自然に呼吸します。"
    }
  },

  // --- Nutrition Data Translations ---
  nutritionData: {
    dailyTips: [
      {
        category: "水分補給",
        title: "朝起きたらコップ1杯のお水を",
        detail: "代謝を高め、関節を潤し、朝のエネルギーを引き出します。",
        icon: "🥛"
      },
      {
        category: "筋肉を守るタンパク質",
        title: "毎回の食事にタンパク質を取り入れましょう",
        detail: "関節と筋肉の強さを守るため、タンパク質（卵、ヨーグルト、鶏肉、豆類、豆腐など）を摂取しましょう。",
        icon: "🍳"
      },
      {
        category: "骨と関節の健康",
        title: "カルシウムとビタミンDを意識的に",
        detail: "緑黄色野菜、アーモンド、牛乳、ごま、そして10分間の日光浴で骨密度を高めましょう。",
        icon: "🦴"
      },
      {
        category: "持続するエネルギー",
        title: "食物繊維が豊富な自然食品",
        detail: "オートミール、ベリー類、野菜は血糖値を安定させ、消化を助けます。",
        icon: "🌾"
      }
    ],
    mealIdeas: [
      {
        meal: "朝食",
        title: "温かいプロテイン・オートミール",
        description: "チアシード、バナナのスライス、クルミ、牛乳またはヨーグルトを添えたオートミール。",
        calories: "~320 kcal"
      },
      {
        meal: "昼食",
        title: "レインボー・プロテインボウル",
        description: "緑黄色野菜、グリルしたカッテージチーズ/鶏肉、きゅうり、トマト、オリーブオイルと全粒粉トースト。",
        calories: "~410 kcal"
      },
      {
        meal: "間食",
        title: "アーモンドとリンゴ",
        description: "午後のエネルギー補給に、リンゴのスライスと生アーモンド10〜12粒。",
        calories: "~180 kcal"
      },
      {
        meal: "夕食",
        title: "豆腐/カッテージチーズと蒸し野菜",
        description: "蒸したブロッコリー、ニンジン、サツマイモを添えた豆腐またはカッテージチーズ。",
        calories: "~450 kcal"
      }
    ]
  }
};
