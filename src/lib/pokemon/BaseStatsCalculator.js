/**
 * ポケモンの実数計算の基本クラス
 */
export default class BaseStatsCalculator {
  /**
   * 努力値の最小値
   */
  static MinEffortValue = 0

  /**
   * 努力値のちょい振り
   */
  static LittleEffortValue = 4

  /**
   * 努力値の最大値
   */
  static MaxEffortValue = 252

  /**
   * 努力値の間隔 (Lv.50想定)
   */
  static IntervalEffortValue = 8

  /**
   * 補正ランクの最小値
   */
  static MinRank = -6

  /**
   * 補正ランクの最大値
   */
  static MaxRank = 6

  /**
   * レベルの最小値
   */
  static MinLevel = 1

  /**
   * レベルの最大値
   */
  static MaxLevel = 100

  /**
   * 種族値 (0~)
   *
   * @var {Number} baseStats
   */
  baseStats = 0

  /**
   * 努力値 (0~252)
   *
   * @var {Number} effortValue
   */
  effortValue = BaseStatsCalculator.MaxEffortValue

  /**
   * 性格補正値 (0.9/1.0/1.1)
   *
   * @var {Number} natureCorrection
   */
  natureCorrection = 1.1

  /**
   * レベル (1~100)
   *
   * @var {Number} level
   * @throws {Error}
   */
  level = 50

  /**
   * 補正ランク (-6~+6)
   */
  rank = 0

  /**
   * 種族値を設定
   *
   * @param {Number|String} baseStats
   * @throws {Error}
   */
  setBaseStats(baseStats) {
    const target = Number(baseStats)
    if (target < 1) {
      throw new Error('BaseStats is invalid.')
    }
    this.baseStats = target
  }

  /**
   * 努力値を設定
   *
   * @param {Number|String} effortValue
   * @throws {Error}
   */
  setEffortValue(effortValue) {
    const target = Number(effortValue)
    if (
      target < BaseStatsCalculator.MinEffortValue ||
      target > BaseStatsCalculator.MaxEffortValue
    ) {
      throw new Error('EffortValue is invalid')
    }
    this.effortValue = target
  }

  /**
   * 性格補正値を設定
   *
   * @param {Number|String} natureCorrection
   * @throws {Error}
   */
  setNatureCorrection(natureCorrection) {
    const target = Number(natureCorrection)
    switch (target) {
      case -1:
        this.natureCorrection = 0.9
        break
      case 0:
        this.natureCorrection = 1.0
        break
      case 1:
        this.natureCorrection = 1.1
        break
      default:
        throw new Error('NatureeCorrection is invalid.')
    }
  }

  /**
   * レベルを設定
   *
   * @param {Number|String} level
   * @throws {Error}
   */
  setLevel(level) {
    const target = Number(level)
    if (
      target < BaseStatsCalculator.MinLevel ||
      target > BaseStatsCalculator.MaxLevel
    ) {
      throw new Error('Level is invalid.')
    }
    this.level = target
  }

  /**
   * 補正ランクを設定
   *
   * @param {Number|String} rank
   * @throws {Error}
   */
  setRank(rank) {
    const target = Number(rank)
    if (
      rank < BaseStatsCalculator.MinRank ||
      rank > BaseStatsCalculator.MaxRank
    ) {
      throw new Error('Rank is invalid.')
    }
    this.rank = target
  }

  /**
   * 現在の設定から実数値を計算する
   *
   * @return {Number}
   */
  calc() {
    // 通常の実数値を計算
    let actualStats = Math.floor(
      ((this.baseStats * 2 + 31 + this.effortValue / 4) * (this.level / 100) +
        5) *
        this.natureCorrection
    )
    // ランク補正をかける
    if (this.rank > 0) {
      actualStats = Math.floor((actualStats * (this.rank + 2)) / 2)
    } else if (this.rank < 0) {
      actualStats = Math.floor((actualStats * 2) / (Math.abs(this.rank) + 2))
    }
    return actualStats
  }
}
