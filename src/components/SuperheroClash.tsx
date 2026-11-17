
import { useEffect, useState } from 'react'
import { ArrowLeft, Clock3, RefreshCw, Swords, Trophy, Zap } from 'lucide-react'

type Side = 'blue' | 'red'
type Stage = 'intro' | 'powers' | 'battle' | 'result'

type Power = {
  name: string
  icon: string
  strength: number
  color: string
}

type Hero = {
  id: string
  name: string
  side: Side
  powers: Power[]
}

type Props = {
  onExit: () => void
  onWin?: () => void
}

const heroNames: { name: string; side: Side }[] = [
  { name: 'Captain Global', side: 'blue' },
  { name: 'Thunder Falcon', side: 'blue' },
  { name: 'Galaxy Guardian', side: 'blue' },
  { name: 'Lightning Knight', side: 'blue' },
  { name: 'Shadow Star', side: 'red' },
  { name: 'Flame Queen', side: 'red' },
  { name: 'Storm Warrior', side: 'red' },
  { name: 'Crystal Phoenix', side: 'red' },
]

const bluePowers: Power[] = [
  { name: 'Thunder Blast', icon: '⚡', strength: 78, color: 'blue' },
  { name: 'Power Shield', icon: '🛡️', strength: 68, color: 'cyan' },
  { name: 'Speed Dash', icon: '💨', strength: 73, color: 'sky' },
  { name: 'Cosmic Punch', icon: '👊', strength: 86, color: 'purple' },
  { name: 'Star Beam', icon: '🌟', strength: 81, color: 'gold' },
  { name: 'Ice Wave', icon: '❄️', strength: 70, color: 'ice' },
  { name: 'Gravity Push', icon: '🌀', strength: 84, color: 'violet' },
]

const redPowers: Power[] = [
  { name: 'Flame Strike', icon: '🔥', strength: 82, color: 'red' },
  { name: 'Shadow Wave', icon: '🌑', strength: 76, color: 'purple' },
  { name: 'Solar Burst', icon: '☀️', strength: 88, color: 'gold' },
  { name: 'Wind Cutter', icon: '🌪️', strength: 72, color: 'cyan' },
  { name: 'Meteor Smash', icon: '☄️', strength: 85, color: 'orange' },
  { name: 'Crystal Guard', icon: '💎', strength: 69, color: 'ice' },
  { name: 'Phoenix Fire', icon: '🪽', strength: 80, color: 'red' },
]

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

const makeHero = (side: Side, previous?: string): Hero => {
  const available = heroNames.filter(
    hero => hero.side === side && hero.name !== previous
  )

  const picked =
    available[Math.floor(Math.random() * available.length)] ||
    heroNames.find(hero => hero.side === side)!

  const powers = shuffle(side === 'blue' ? bluePowers : redPowers)
    .slice(0, 5)
    .map(power => ({ ...power }))

  return {
    id: `${side}-${Math.random().toString(36).slice(2, 8)}`,
    name: picked.name,
    side,
    powers,
  }
}

const shuffledPowers = (hero: Hero): Power[] => shuffle(hero.powers)

export default function SuperheroClash({ onExit, onWin }: Props) {
  const [stage, setStage] = useState<Stage>('intro')

  const [blue, setBlue] = useState<Hero>(() => makeHero('blue'))
  const [red, setRed] = useState<Hero>(() => makeHero('red'))

  const [blueName, setBlueName] = useState(blue.name)
  const [redName, setRedName] = useState(red.name)

  const [blueHp, setBlueHp] = useState(100)
  const [redHp, setRedHp] = useState(100)

  const [seconds, setSeconds] = useState(60)
  const [round, setRound] = useState(1)

  const [blueChoice, setBlueChoice] = useState<number | null>(null)
  const [redChoice, setRedChoice] = useState<number | null>(null)

  const [blueRoundPowers, setBlueRoundPowers] = useState<Power[]>(
    () => shuffledPowers(blue)
  )

  const [redRoundPowers, setRedRoundPowers] = useState<Power[]>(
    () => shuffledPowers(red)
  )

  const [battleMessage, setBattleMessage] = useState(
    'Choose your secret powers!'
  )

  const [battleLog, setBattleLog] = useState('')
  const [winner, setWinner] = useState<Hero | null>(null)
  const [attacking, setAttacking] = useState(false)
  const [roundDone, setRoundDone] = useState(false)

  const [damage, setDamage] = useState({
    blue: 0,
    red: 0,
  })

  useEffect(() => {
    if (stage !== 'battle' || winner) return

    const timer = window.setInterval(() => {
      setSeconds(value => Math.max(0, value - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [stage, winner])

  useEffect(() => {
    if (stage !== 'battle' || seconds > 0 || winner) return

    const finalWinner =
      blueHp === redHp ? null : blueHp > redHp ? blue : red

    setWinner(finalWinner)
    setStage('result')

    if (finalWinner) onWin?.()
  }, [seconds, stage, winner, blueHp, redHp, blue, red, onWin])

  const freshMatch = () => {
    const nextBlue = makeHero('blue', blue.name)
    const nextRed = makeHero('red', red.name)

    setBlue(nextBlue)
    setRed(nextRed)

    setBlueName(nextBlue.name)
    setRedName(nextRed.name)

    setBlueHp(100)
    setRedHp(100)

    setSeconds(60)
    setRound(1)

    setBlueChoice(null)
    setRedChoice(null)

    setBlueRoundPowers(shuffledPowers(nextBlue))
    setRedRoundPowers(shuffledPowers(nextRed))

    setBattleMessage('Choose your secret powers!')
    setBattleLog('')

    setWinner(null)
    setAttacking(false)
    setRoundDone(false)

    setDamage({ blue: 0, red: 0 })

    setStage('intro')
  }

  const startShowcase = () => {
    const updatedBlue = {
      ...blue,
      name: blueName.trim() || 'Blue Hero',
    }

    const updatedRed = {
      ...red,
      name: redName.trim() || 'Red Hero',
    }

    setBlue(updatedBlue)
    setRed(updatedRed)

    setStage('powers')
  }

  const startBattle = () => {
    setBlueRoundPowers(shuffledPowers(blue))
    setRedRoundPowers(shuffledPowers(red))

    setBlueChoice(null)
    setRedChoice(null)

    setRoundDone(false)
    setBattleMessage('Both players: choose one power!')

    setSeconds(60)
    setStage('battle')
  }

  const resolveRound = () => {
    if (
      blueChoice === null ||
      redChoice === null ||
      attacking ||
      roundDone
    ) {
      return
    }

    setAttacking(true)
    setBattleMessage('SUPERPOWER CLASH!')

    const bluePower = blueRoundPowers[blueChoice]
    const redPower = redRoundPowers[redChoice]

    const blueScore =
      bluePower.strength + Math.floor(Math.random() * 30)

    const redScore =
      redPower.strength + Math.floor(Math.random() * 30)

    window.setTimeout(() => {
      if (blueScore === redScore) {
        setBattleLog(
          `${bluePower.name} and ${redPower.name} collide — it's a draw!`
        )

        setBattleMessage('DRAW! No damage this round.')
        setDamage({ blue: 0, red: 0 })
      } else if (blueScore > redScore) {
        const hit = 15 + Math.floor(Math.random() * 6)
        const nextHealth = Math.max(0, redHp - hit)

        setRedHp(nextHealth)
        setDamage({ blue: 0, red: hit })

        setBattleLog(
          `${blue.name} wins the clash with ${bluePower.name}! ${red.name} takes ${hit}% damage.`
        )

        setBattleMessage(`${blue.name.toUpperCase()} POWER WINS!`)

        if (nextHealth <= 0) {
          setWinner(blue)
          setStage('result')
          onWin?.()
        }
      } else {
        const hit = 15 + Math.floor(Math.random() * 6)
        const nextHealth = Math.max(0, blueHp - hit)

        setBlueHp(nextHealth)
        setDamage({ blue: hit, red: 0 })

        setBattleLog(
          `${red.name} wins the clash with ${redPower.name}! ${blue.name} takes ${hit}% damage.`
        )

        setBattleMessage(`${red.name.toUpperCase()} POWER WINS!`)

        if (nextHealth <= 0) {
          setWinner(red)
          setStage('result')
          onWin?.()
        }
      }

      setAttacking(false)
      setRoundDone(true)
    }, 1500)
  }

  const nextRound = () => {
    if (stage !== 'battle' || winner) return

    setRound(value => value + 1)

    setBlueChoice(null)
    setRedChoice(null)

    setRoundDone(false)
    setDamage({ blue: 0, red: 0 })

    setBlueRoundPowers(shuffledPowers(blue))
    setRedRoundPowers(shuffledPowers(red))

    setBattleMessage(
      'New round! Choose again — powers have been shuffled.'
    )

    setBattleLog('')
  }

  const portrait = (side: Side) => (
    <div className={`sc-hero-portrait ${side}`}>
      <div className="sc-hero-glow" />
      <div className="sc-hero-art" />
      <span className="sc-hero-caption">
        {side === 'blue' ? 'BLUE HERO' : 'RED HERO'}
      </span>
    </div>
  )

  const health = (value: number) => (
    <div className="sc-health-track">
      <div
        className="sc-health-fill"
        style={{ width: `${value}%` }}
      />
      <b>{value}%</b>
    </div>
  )

  return (
    <div className="sc-page">
      <button className="sc-back" onClick={onExit}>
        <ArrowLeft size={17} />
        Back to Dashboard
      </button>

      {stage === 'intro' && (
        <>
          <div className="sc-intro-poster">
            <img
              src="/images/superhero-clash-poster.png"
              alt="Superhero Clash Punjabi Arena"
            />

            <button
              className="sc-play-poster"
              onClick={startShowcase}
            >
              ⚔ PLAY NOW
            </button>
          </div>

          <div className="sc-setup-panel">
            <div className="sc-panel-heading">
              <Swords />
              <h2>CREATE YOUR HEROES</h2>
            </div>

            <div className="sc-hero-edit-grid">
              <div className="sc-hero-edit blue-edit">
                {portrait('blue')}

                <label>
                  PLAYER 1 NAME
                  <input
                    value={blueName}
                    maxLength={22}
                    onChange={event => setBlueName(event.target.value)}
                  />
                </label>

                <button
                  onClick={() => {
                    const hero = makeHero('blue', blue.name)
                    setBlue(hero)
                    setBlueName(hero.name)
                  }}
                >
                  <RefreshCw size={15} />
                  Random hero
                </button>
              </div>

              <div className="sc-vs-mark">VS</div>

              <div className="sc-hero-edit red-edit">
                {portrait('red')}

                <label>
                  PLAYER 2 NAME
                  <input
                    value={redName}
                    maxLength={22}
                    onChange={event => setRedName(event.target.value)}
                  />
                </label>

                <button
                  onClick={() => {
                    const hero = makeHero('red', red.name)
                    setRed(hero)
                    setRedName(hero.name)
                  }}
                >
                  <RefreshCw size={15} />
                  Random hero
                </button>
              </div>
            </div>

            <button className="sc-primary" onClick={startShowcase}>
              NEXT <span>➜</span>
            </button>
          </div>
        </>
      )}

      {stage === 'powers' && (
        <div className="sc-setup-panel sc-powers-panel">
          <div className="sc-panel-heading">
            <Zap />
            <h2>YOUR FIVE SUPERPOWERS</h2>
          </div>

          <div className="sc-power-showcase">
            {[blue, red].map(hero => (
              <div
                className={`sc-power-side ${hero.side}`}
                key={hero.id}
              >
                <h3>{hero.name}</h3>

                {hero.powers.map((power, index) => (
                  <div className="sc-power-preview" key={power.name}>
                    <span>{power.icon}</span>
                    <b>
                      {index + 1}. {power.name}
                    </b>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="sc-hide-note">
            Memorise your powers! They will be hidden when the battle begins.
          </p>

          <button className="sc-primary" onClick={startBattle}>
            START BATTLE <Swords size={18} />
          </button>
        </div>
      )}

      {stage === 'battle' && (
        <>
          <div className="sc-battle-top">
            <div>
              <span>ROUND</span>
              <b>{round}</b>
            </div>

            <div className="sc-clock">
              <Clock3 />
              {`00:${String(seconds).padStart(2, '0')}`}
            </div>

            <div>
              <span>1 VS 1</span>
              <b>POWER CLASH</b>
            </div>
          </div>

          <div
            className={`sc-battle-arena ${
              attacking ? 'is-attacking' : ''
            } ${roundDone ? 'round-done' : ''}`}
          >
            <section className="sc-fighter blue-fighter">
              <div className="sc-fighter-name">{blue.name}</div>

              {portrait('blue')}

              {health(blueHp)}

              <div className="sc-number-powers">
                {[1, 2, 3, 4, 5].map(number => (
                  <button
                    key={number}
                    disabled={blueChoice !== null || roundDone}
                    className={
                      blueChoice === number - 1 ? 'chosen' : ''
                    }
                    onClick={() => setBlueChoice(number - 1)}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <small>
                {blueChoice === null
                  ? 'PLAYER 1 · PICK A POWER'
                  : 'POWER SELECTED'}
              </small>
            </section>

            <div className="sc-battle-center">
              <div className="sc-energy-line" />

              {attacking &&
                blueChoice !== null &&
                redChoice !== null && (
                  <div className="sc-attack-burst">
                    <span>{blueRoundPowers[blueChoice].icon}</span>
                    <b>⚡</b>
                    <span>{redRoundPowers[redChoice].icon}</span>
                  </div>
                )}

              <div className="sc-vs-core">VS</div>

              <div className="sc-battle-message">
                {battleMessage}
              </div>

              {blueChoice !== null &&
                redChoice !== null &&
                !roundDone && (
                  <button
                    className="sc-attack-button"
                    onClick={resolveRound}
                    disabled={attacking}
                  >
                    {attacking ? 'ATTACKING…' : '⚡ RELEASE ATTACK'}
                  </button>
                )}

              {roundDone && (
                <>
                  <div className="sc-result-powers">
                    <span>
                      {blueRoundPowers[blueChoice!].icon}{' '}
                      {blueRoundPowers[blueChoice!].name}
                    </span>

                    <b>VS</b>

                    <span>
                      {redRoundPowers[redChoice!].icon}{' '}
                      {redRoundPowers[redChoice!].name}
                    </span>
                  </div>

                  <p className="sc-round-log">{battleLog}</p>

                  <button
                    className="sc-next-round"
                    onClick={nextRound}
                  >
                    NEXT ROUND <span>➜</span>
                  </button>
                </>
              )}
            </div>

            <section className="sc-fighter red-fighter">
              <div className="sc-fighter-name">{red.name}</div>

              {portrait('red')}

              {health(redHp)}

              <div className="sc-number-powers">
                {[1, 2, 3, 4, 5].map(number => (
                  <button
                    key={number}
                    disabled={redChoice !== null || roundDone}
                    className={
                      redChoice === number - 1 ? 'chosen' : ''
                    }
                    onClick={() => setRedChoice(number - 1)}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <small>
                {redChoice === null
                  ? 'PLAYER 2 · PICK A POWER'
                  : 'POWER SELECTED'}
              </small>
            </section>
          </div>

          <div className="sc-battle-hint">
            Both players use this same screen. Choose your numbers,
            then release the attack together.
          </div>
        </>
      )}

      {stage === 'result' && (
        <div className="sc-winner-screen">
          <div className="sc-confetti">✦ ✧ ★ ✦ ✧ ★ ✦</div>

          <Trophy size={66} />

          <div className="sc-winner-label">ARENA CHAMPION</div>

          <h1>
            {winner
              ? winner.name
              : blueHp === redHp
                ? 'IT’S A DRAW!'
                : blueHp > redHp
                  ? blue.name
                  : red.name}
          </h1>

          <h2>{winner ? 'WINS THE GAME!' : 'TIME IS UP!'}</h2>

          <div className="sc-final-scores">
            <div>
              🔵 {blue.name}
              <b>{blueHp}%</b>
            </div>

            <div>
              🔴 {red.name}
              <b>{redHp}%</b>
            </div>
          </div>

          <button className="sc-primary" onClick={freshMatch}>
            <RefreshCw /> PLAY AGAIN
          </button>

          <button className="sc-back-bottom" onClick={onExit}>
            BACK TO DASHBOARD
          </button>
        </div>
      )}
    </div>
  )
}
