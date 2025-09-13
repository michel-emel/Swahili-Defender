// ==================== WORDS MANAGEMENT ====================
class WordsManager {
  constructor() {
    this.dictionary = [];
    this.loadDictionary();
  }

  loadDictionary() {
    this.dictionary = [
      { english: "hello", swahili: "hujambo" },
      { english: "water", swahili: "maji" },
      { english: "fire", swahili: "moto" },
      { english: "house", swahili: "nyumba" },
      { english: "tree", swahili: "mti" },
      { english: "book", swahili: "kitabu" },
      { english: "car", swahili: "gari" },
      { english: "food", swahili: "chakula" },
      { english: "money", swahili: "pesa" },
      { english: "friend", swahili: "rafiki" },
      { english: "school", swahili: "shule" },
      { english: "love", swahili: "upendo" },
      { english: "moon", swahili: "mwezi" },
      { english: "sun", swahili: "jua" },
      { english: "child", swahili: "mtoto" },
      { english: "woman", swahili: "mwanamke" },
      { english: "man", swahili: "mwanaume" },
      { english: "door", swahili: "mlango" },
      { english: "window", swahili: "dirisha" },
      { english: "table", swahili: "meza" },
      { english: "river", swahili: "mto" },
      { english: "mountain", swahili: "mlima" },
      { english: "bird", swahili: "ndege" },
      { english: "fish", swahili: "samaki" },
      { english: "dog", swahili: "mbwa" }
    ];
  }

  getRandomPair() {
    return this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
  }

  getRandomPairs(count) {
    const pairs = [];
    const usedIndices = new Set();
    while (pairs.length < count && pairs.length < this.dictionary.length) {
      const index = Math.floor(Math.random() * this.dictionary.length);
      if (!usedIndices.has(index)) {
        usedIndices.add(index);
        pairs.push(this.dictionary[index]);
      }
    }
    return pairs;
  }
}