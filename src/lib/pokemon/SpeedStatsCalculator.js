import BaseStatsCalclator from './BaseStatsCalculator'

/**
 * ポケモンの実数計算の素早さ専用計算クラス
 */
export default class SpeedStatsCalculator extends BaseStatsCalclator {
  /**
   * 追い風状態かどうか
   *
   * @var {Boolean}
   */
  isActiveTailwind = false

  /**
   * こだわりスカーフを持っているかどうか
   *
   * @var {Boolean}
   */
  hasScarf = false

  /**
   * まひ状態かどうか
   *
   * @var {Boolean}
   */
  isParalysis = false

  /**
   * 天候による素早さ補正特性があるかどうか
   *
   * @var {Boolean}
   */
  isActiveWeather = false

  /**
   * おいかせ状態かどうかセット
   *
   * @param {Boolean} isActiveTailwind
   */
  setIsActiveTailwind(isActiveTailwind) {
    this.isActiveTailwind = Boolean(isActiveTailwind)
  }

  /**
   * こだわりスカーフ所持状態かセット
   *
   * @param {Boolean} hasScarf
   */
  setHasScarf(hasScarf) {
    this.hasScarf = Boolean(hasScarf)
  }

  /**
   * まひ状態かどうかセット
   *
   * @param {Boolean} isParalysis
   */
  setIsParalysis(isParalysis) {
    this.isParalysis = Boolean(isParalysis)
  }

  /**
   * 天候による素早さ補正特性があるかどうかセット
   *
   * @param {Boolean} isActiveWeather
   */
  setIsActiveWeather(isActiveWeather) {
    this.isActiveWeather = Boolean(isActiveWeather)
  }

  /**
   * 基本の計算に加えて、素早さ専用の補正を入れて計算
   *
   * @override
   * @return {Number}
   */
  calc() {
    let actualStats = super.calc()
    if (this.hasScarf) {
      actualStats = Math.floor(actualStats * 1.5)
    }
    if (this.isActiveWeather) {
      actualStats = Math.floor(actualStats * 2)
    }
    if (this.isActiveTailwind) {
      actualStats = Math.floor(actualStats * 2)
    }
    if (this.isParalysis) {
      actualStats = Math.floor(actualStats / 2)
    }
    return actualStats
  }
}
