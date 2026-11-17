import { useState } from 'react'
import { ArrowLeft, RefreshCw, Swords, Trophy, Zap, Crown } from 'lucide-react'

type Side = 'blue' | 'red'
type Power = { name: string; strength: number; tone: string; symbol: string }
type Hero = { id: string; name: string; side: Side; image: string; powers: Power[] }
type Props = { onExit: () => void; onWin?: () => void }
type Stage = 'intro' | 'showcase' | 'battle' | 'result'

const powerPool: Record<Side, Power[]> = {
  blue: [
    { name: 'Thunder Strike', strength: 86, tone: 'electric', symbol: '⚡' },
    { name: 'Titan Shield', strength: 70, tone: 'shield', symbol: '◈' },
    { name: 'Sonic Dash', strength: 78, tone: 'wind', symbol: '➤' },
    { name: 'Cosmic Beam', strength: 91, tone: 'cosmic', symbol: '✦' },
    { name: 'Frost Wave', strength: 74, tone: 'ice', symbol: '❄' },
    { name: 'Gravity Crush', strength: 88, tone: 'gravity', symbol: '◉' },
    { name: 'Star Burst', strength: 82, tone: 'cosmic', symbol: '✧' },
  ],
  red: [
    { name: 'Inferno Blast', strength: 88, tone: 'fire', symbol: '✹' },
    { name: 'Meteor Smash', strength: 90, tone: 'meteor', symbol: '◆' },
    { name: 'Shadow Surge', strength: 77, tone: 'shadow', symbol: '◐' },
    { name: 'Solar Flare', strength: 92, tone: 'solar', symbol: '☼' },
    { name: 'Cyclone Edge', strength: 76, tone: 'wind', symbol: '⟲' },
    { name: 'Dragon Force', strength: 85, tone: 'fire', symbol: '✦' },
    { name: 'Crystal Guard', strength: 72, tone: 'ice', symbol: '◇' },
  ],
}
const heroOptions: Record<Side, { name: string; image: string }[]> = {
  blue: [
    { name: 'Thunder King', image: '/images/hero-blue.png' },
    { name: 'Sky Guardian', image: '/images/hero-blue.png' },
    { name: 'Lightning Ace', image: '/images/hero-blue.png' },
    { name: 'Cosmic Knight', image: '/images/hero-blue.png' },
  ],
  red: [
    { name: 'Fire Storm', image: '/images/hero-red.png' },
    { name: 'Shadow Dragon', image: '/images/hero-red.png' },
    { name: 'Solar Warrior', image: '/images/hero-red.png' },
    { name: 'Flame Phantom', image: '/images/hero-red.png' },
  ],
}
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)
const makeHero = (side: Side, previous?: string): Hero => {
  const choices = heroOptions[side].filter(item => item.name !== previous)
  const picked = choices[Math.floor(Math.random() * choices.length)] || heroOptions[side][0]
  return { id: `${side}-${Math.random().toString(36).slice(2)}`, name: picked.name, side, image: picked.image, powers: shuffle(powerPool[side]).slice(0, 5) }
}
const shuffledFive = (hero: Hero) => shuffle(hero.powers)

export default function SuperheroClash({ onExit, onWin }: Props) {
  const [stage, setStage] = useState<Stage>('intro')
  const [blue, setBlue] = useState<Hero>(() => makeHero('blue'))
  const [red, setRed] = useState<Hero>(() => makeHero('red'))
  const [blueName, setBlueName] = useState(blue.name)
  const [redName, setRedName] = useState(red.name)
  const [blueHp, setBlueHp] = useState(100)
  const [redHp, setRedHp] = useState(100)
  const [round, setRound] = useState(1)
  const [bluePicks, setBluePicks] = useState<Power[]>(() => shuffledFive(blue))
  const [redPicks, setRedPicks] = useState<Power[]>(() => shuffledFive(red))
  const [blueChoice, setBlueChoice] = useState<number | null>(null)
  const [redChoice, setRedChoice] = useState<number | null>(null)
  const [turn, setTurn] = useState<Side>('blue')
  const [attacking, setAttacking] = useState(false)
  const [hitSide, setHitSide] = useState<Side | null>(null)
  const [battleMessage, setBattleMessage] = useState('PLAYER 1 — CHOOSE YOUR POWER')
  const [battleLog, setBattleLog] = useState('')
  const [winner, setWinner] = useState<Hero | null>(null)
  const [blueUsed, setBlueUsed] = useState<number[]>([])
  const [redUsed, setRedUsed] = useState<number[]>([])


  const randomizeHero = (side: Side) => {
    if (side === 'blue') { const next = makeHero('blue', blue.name); setBlue(next); setBlueName(next.name) }
    else { const next = makeHero('red', red.name); setRed(next); setRedName(next.name) }
  }
  const beginShowcase = () => {
    setBlue(h => ({ ...h, name: blueName.trim() || 'Player 1 Hero' }))
    setRed(h => ({ ...h, name: redName.trim() || 'Player 2 Hero' }))
    setStage('showcase')
  }
  const beginBattle = () => {
    setBluePicks(shuffledFive(blue)); setRedPicks(shuffledFive(red))
    setBlueChoice(null); setRedChoice(null); setBlueUsed([]); setRedUsed([])
    setTurn('blue'); setBattleMessage('PLAYER 1 — CHOOSE YOUR POWER'); setBattleLog('')
    setStage('battle')
  }
  const choosePower = (side: Side, index: number) => {
    if (attacking || (side === 'blue' && (blueChoice !== null || blueUsed.includes(index))) || (side === 'red' && (redChoice !== null || redUsed.includes(index)))) return
    if (side === 'blue') { setBlueChoice(index); setTurn('red'); setBattleMessage('PLAYER 2 — CHOOSE YOUR POWER') }
    else { setRedChoice(index); setBattleMessage('BOTH POWERS LOCKED — RELEASE THE ATTACK!') }
  }
  const releaseAttack = () => {
    if (blueChoice === null || redChoice === null || attacking) return
    const bp = bluePicks[blueChoice]
    const rp = redPicks[redChoice]
    const blueScore = bp.strength + Math.floor(Math.random() * 24)
    const redScore = rp.strength + Math.floor(Math.random() * 24)
    const victor: Side = blueScore >= redScore ? 'blue' : 'red'
    const damage = 15 + Math.floor(Math.random() * 6)
    setAttacking(true); setHitSide(victor === 'blue' ? 'red' : 'blue')
    setBattleMessage('SUPERPOWER COLLISION!')
    window.setTimeout(() => {
      if (victor === 'blue') {
        const next = Math.max(0, redHp - damage); setRedHp(next)
        setBattleLog(`${blue.name}'s ${bp.name} overpowers ${red.name}'s ${rp.name}. ${red.name} loses ${damage}% energy.`)
        setBattleMessage(`${blue.name.toUpperCase()} WINS THIS ROUND!`)
        if (next === 0) { setWinner(blue); setStage('result'); onWin?.() }
      } else {
        const next = Math.max(0, blueHp - damage); setBlueHp(next)
        setBattleLog(`${red.name}'s ${rp.name} overpowers ${blue.name}'s ${bp.name}. ${blue.name} loses ${damage}% energy.`)
        setBattleMessage(`${red.name.toUpperCase()} WINS THIS ROUND!`)
        if (next === 0) { setWinner(red); setStage('result'); onWin?.() }
      }
      setBlueUsed(v => [...v, blueChoice]); setRedUsed(v => [...v, redChoice])
      setAttacking(false); setHitSide(null)
      setBlueChoice(null); setRedChoice(null)
    }, 1350)
  }
  const nextRound = () => {
    setRound(v => v + 1)
    // Every round gets a fresh random ordering and a fresh five-power selection.
    setBluePicks(shuffledFive({ ...blue, powers: shuffle(powerPool.blue).slice(0, 5) }))
    setRedPicks(shuffledFive({ ...red, powers: shuffle(powerPool.red).slice(0, 5) }))
    setBlueUsed([]); setRedUsed([]); setBlueChoice(null); setRedChoice(null)
    setTurn('blue'); setBattleLog(''); setBattleMessage('NEW ROUND — PLAYER 1 CHOOSE FIRST')
  }
  const restart = () => {
    const nextBlue = makeHero('blue', blue.name); const nextRed = makeHero('red', red.name)
    setBlue(nextBlue); setRed(nextRed); setBlueName(nextBlue.name); setRedName(nextRed.name)
    setBlueHp(100); setRedHp(100); setRound(1); setWinner(null); setBlueUsed([]); setRedUsed([])
    setBluePicks(shuffledFive(nextBlue)); setRedPicks(shuffledFive(nextRed))
    setBlueChoice(null); setRedChoice(null); setTurn('blue'); setBattleLog(''); setStage('intro')
  }
  const heroPanel = (hero: Hero, hp: number, side: Side, choice: number | null, used: number[]) => (
    <section className={`gsh-player gsh-${side} ${hitSide === side ? 'gsh-hit' : ''}`}>
      <div className="gsh-player-head"><span>{side === 'blue' ? 'PLAYER 1' : 'PLAYER 2'}</span><strong>{hero.name}</strong><div className="gsh-health"><i style={{ width: `${hp}%` }}/><b>{hp}%</b></div></div>
      <div className="gsh-character-wrap"><img className="gsh-character" src={hero.image} alt={`${hero.name} hero`}/><div className="gsh-character-aura"/></div>
      <div className="gsh-power-label">{choice === null ? (side === turn ? 'CHOOSE A POWER' : 'WAIT FOR YOUR TURN') : 'POWER LOCKED'}</div>
      <div className="gsh-power-buttons">{[0,1,2,3,4].map(n => <button key={n} disabled={choice !== null || used.includes(n) || attacking || (side !== turn && choice === null)} className={`${choice === n ? 'selected' : ''} ${used.includes(n) ? 'used' : ''}`} onClick={() => choosePower(side, n)}><span>{n + 1}</span></button>)}</div>
    </section>
  )

  return <div className="gsh-screen">
    <div className="gsh-back-row"><button onClick={onExit}><ArrowLeft size={17}/> EXIT ARENA</button><div className="gsh-brand"><Crown size={18}/> GLOBAL SUPER HERO</div><span className="gsh-round-tag">{stage === 'battle' ? `ROUND ${round}` : '1 VS 1 ARENA'}</span></div>
    {stage === 'intro' && <div className="gsh-intro">
      <div className="gsh-poster"><img src="/images/global-super-hero-poster.png" alt="GLOBAL SUPER HERO — Punjabi Game Arena"/><button onClick={beginShowcase}>ENTER THE ARENA <Swords size={19}/></button></div>
      <div className="gsh-create"><div className="gsh-section-title">CREATE YOUR CHAMPIONS</div><div className="gsh-edit-grid">
        {[{side:'blue' as Side, hero:blue, name:blueName, setName:setBlueName},{side:'red' as Side, hero:red, name:redName, setName:setRedName}].map(({side,hero,name,setName}) => <div className={`gsh-edit-card gsh-edit-${side}`} key={side}><img src={hero.image} alt={hero.name}/><label>{side === 'blue' ? 'PLAYER 1 NAME' : 'PLAYER 2 NAME'}<input value={name} maxLength={22} onChange={e => setName(e.target.value)}/></label><button onClick={() => randomizeHero(side)}><RefreshCw size={14}/> SHUFFLE HERO</button></div>)}
      </div><button className="gsh-primary" onClick={beginShowcase}>SHOW SUPERPOWERS <Zap size={18}/></button></div>
    </div>}
    {stage === 'showcase' && <div className="gsh-showcase"><div className="gsh-section-title">YOUR FIVE SUPERPOWERS</div><div className="gsh-showcase-grid">{[blue,red].map(hero => <div className={`gsh-showcase-side gsh-showcase-${hero.side}`} key={hero.id}><img src={hero.image} alt={hero.name}/><h2>{hero.name}</h2><div>{hero.powers.map((p,i)=><div className="gsh-power-preview" key={p.name}><b>{i+1}</b><span>{p.symbol}</span><strong>{p.name}</strong><small>POWER {p.strength}</small></div>)}</div></div>)}</div><p>Remember your powers. They disappear when the battle begins.</p><button className="gsh-primary" onClick={beginBattle}>START THE BATTLE <Swords size={18}/></button></div>}
    {stage === 'battle' && <div className={`gsh-battle ${attacking ? 'gsh-attacking' : ''}`}>
      <div className="gsh-arena-backdrop"/>
      {heroPanel(blue,blueHp,'blue',blueChoice,blueUsed)}
      <div className="gsh-middle"><div className="gsh-vs">VS</div><div className="gsh-beam gsh-beam-blue"/><div className="gsh-beam gsh-beam-red"/><div className="gsh-impact">✦</div><div className="gsh-message">{battleMessage}</div>{blueChoice !== null && redChoice !== null && <button className="gsh-release" onClick={releaseAttack} disabled={attacking}>{attacking ? 'ATTACK IN PROGRESS…' : 'RELEASE ATTACK'}</button>}{battleLog && <p className="gsh-log">{battleLog}</p>}{!attacking && blueChoice === null && redChoice === null && <span className="gsh-turn-note">PLAYER 1 CHOOSES FIRST</span>}{!attacking && blueChoice !== null && redChoice === null && <span className="gsh-turn-note">PASS THE DEVICE TO PLAYER 2</span>}
        {battleLog && blueHp > 0 && redHp > 0 && <button className="gsh-next" onClick={nextRound}>NEXT ROUND <Zap size={16}/></button>}
      </div>
      {heroPanel(red,redHp,'red',redChoice,redUsed)}
    </div>}
    {stage === 'result' && <div className="gsh-winner"><div className="gsh-confetti">✦ ✧ ★ ✦ ✧ ★ ✦</div><Trophy size={70}/><span>ARENA CHAMPION</span><h1>{winner?.name}</h1><h2>WINS THE GAME!</h2><div className="gsh-score-row"><b>{blue.name} <strong>{blueHp}%</strong></b><b>{red.name} <strong>{redHp}%</strong></b></div><button className="gsh-primary" onClick={restart}><RefreshCw size={18}/> PLAY AGAIN</button><button className="gsh-exit" onClick={onExit}>BACK TO DASHBOARD</button></div>}
  </div>
}
