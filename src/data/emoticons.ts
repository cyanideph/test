// Emoticon data for the chat app

export interface EmoticonCategory {
  id: string
  name: string
  emoticons: Emoticon[]
}

export interface Emoticon {
  id: string
  name: string
  emoji: string
}

export const emoticonCategories: EmoticonCategory[] = [
  {
    id: "smileys",
    name: "Smileys & Emotion",
    emoticons: [
      { id: "smile", name: "Smile", emoji: "😊" },
      { id: "laugh", name: "Laugh", emoji: "😂" },
      { id: "wink", name: "Wink", emoji: "😉" },
      { id: "heart_eyes", name: "Heart Eyes", emoji: "😍" },
      { id: "kiss", name: "Kiss", emoji: "😘" },
      { id: "thinking", name: "Thinking", emoji: "🤔" },
      { id: "sad", name: "Sad", emoji: "😢" },
      { id: "angry", name: "Angry", emoji: "😠" },
      { id: "cool", name: "Cool", emoji: "😎" },
      { id: "surprised", name: "Surprised", emoji: "😮" },
    ],
  },
  {
    id: "gestures",
    name: "People & Body",
    emoticons: [
      { id: "thumbs_up", name: "Thumbs Up", emoji: "👍" },
      { id: "thumbs_down", name: "Thumbs Down", emoji: "👎" },
      { id: "clap", name: "Clap", emoji: "👏" },
      { id: "wave", name: "Wave", emoji: "👋" },
      { id: "pray", name: "Pray", emoji: "🙏" },
      { id: "muscle", name: "Muscle", emoji: "💪" },
      { id: "peace", name: "Peace", emoji: "✌️" },
      { id: "ok_hand", name: "OK Hand", emoji: "👌" },
      { id: "point_up", name: "Point Up", emoji: "☝️" },
      { id: "raised_hands", name: "Raised Hands", emoji: "🙌" },
    ],
  },
  {
    id: "animals",
    name: "Animals & Nature",
    emoticons: [
      { id: "dog", name: "Dog", emoji: "🐶" },
      { id: "cat", name: "Cat", emoji: "🐱" },
      { id: "rabbit", name: "Rabbit", emoji: "🐰" },
      { id: "fox", name: "Fox", emoji: "🦊" },
      { id: "bear", name: "Bear", emoji: "🐻" },
      { id: "panda", name: "Panda", emoji: "🐼" },
      { id: "monkey", name: "Monkey", emoji: "🐵" },
      { id: "penguin", name: "Penguin", emoji: "🐧" },
      { id: "koala", name: "Koala", emoji: "🐨" },
      { id: "butterfly", name: "Butterfly", emoji: "🦋" },
    ],
  },
  {
    id: "food",
    name: "Food & Drink",
    emoticons: [
      { id: "pizza", name: "Pizza", emoji: "🍕" },
      { id: "burger", name: "Burger", emoji: "🍔" },
      { id: "fries", name: "Fries", emoji: "🍟" },
      { id: "hotdog", name: "Hot Dog", emoji: "🌭" },
      { id: "taco", name: "Taco", emoji: "🌮" },
      { id: "sushi", name: "Sushi", emoji: "🍣" },
      { id: "coffee", name: "Coffee", emoji: "☕" },
      { id: "beer", name: "Beer", emoji: "🍺" },
      { id: "wine", name: "Wine", emoji: "🍷" },
      { id: "cake", name: "Cake", emoji: "🍰" },
    ],
  },
  {
    id: "activities",
    name: "Activities",
    emoticons: [
      { id: "soccer", name: "Soccer", emoji: "⚽" },
      { id: "basketball", name: "Basketball", emoji: "🏀" },
      { id: "football", name: "Football", emoji: "🏈" },
      { id: "baseball", name: "Baseball", emoji: "⚾" },
      { id: "tennis", name: "Tennis", emoji: "🎾" },
      { id: "bowling", name: "Bowling", emoji: "🎳" },
      { id: "golf", name: "Golf", emoji: "⛳" },
      { id: "game", name: "Video Game", emoji: "🎮" },
      { id: "trophy", name: "Trophy", emoji: "🏆" },
      { id: "medal", name: "Medal", emoji: "🏅" },
    ],
  },
  {
    id: "travel",
    name: "Travel & Places",
    emoticons: [
      { id: "car", name: "Car", emoji: "🚗" },
      { id: "airplane", name: "Airplane", emoji: "✈️" },
      { id: "rocket", name: "Rocket", emoji: "🚀" },
      { id: "bicycle", name: "Bicycle", emoji: "🚲" },
      { id: "motorcycle", name: "Motorcycle", emoji: "🏍️" },
      { id: "mountain", name: "Mountain", emoji: "⛰️" },
      { id: "beach", name: "Beach", emoji: "🏖️" },
      { id: "city", name: "City", emoji: "🏙️" },
      { id: "camping", name: "Camping", emoji: "🏕️" },
      { id: "hotel", name: "Hotel", emoji: "🏨" },
    ],
  },
  {
    id: "objects",
    name: "Objects",
    emoticons: [
      { id: "phone", name: "Phone", emoji: "📱" },
      { id: "computer", name: "Computer", emoji: "💻" },
      { id: "tv", name: "TV", emoji: "📺" },
      { id: "camera", name: "Camera", emoji: "📷" },
      { id: "book", name: "Book", emoji: "📚" },
      { id: "gift", name: "Gift", emoji: "🎁" },
      { id: "money", name: "Money", emoji: "💰" },
      { id: "key", name: "Key", emoji: "🔑" },
      { id: "lock", name: "Lock", emoji: "🔒" },
      { id: "bulb", name: "Light Bulb", emoji: "💡" },
    ],
  },
  {
    id: "symbols",
    name: "Symbols",
    emoticons: [
      { id: "heart", name: "Heart", emoji: "❤️" },
      { id: "star", name: "Star", emoji: "⭐" },
      { id: "fire", name: "Fire", emoji: "🔥" },
      { id: "check", name: "Check Mark", emoji: "✅" },
      { id: "x", name: "Cross Mark", emoji: "❌" },
      { id: "warning", name: "Warning", emoji: "⚠️" },
      { id: "question", name: "Question", emoji: "❓" },
      { id: "exclamation", name: "Exclamation", emoji: "❗" },
      { id: "music", name: "Music", emoji: "🎵" },
      { id: "sparkles", name: "Sparkles", emoji: "✨" },
    ],
  },
]

export const getEmoticonById = (id: string): Emoticon | undefined => {
  for (const category of emoticonCategories) {
    const emoticon = category.emoticons.find((e) => e.id === id)
    if (emoticon) {
      return emoticon
    }
  }
  return undefined
}

export const getAllEmoticons = (): Emoticon[] => {
  return emoticonCategories.flatMap((category) => category.emoticons)
}
