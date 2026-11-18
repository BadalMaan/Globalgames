import { useState } from 'react'
import { ArrowLeft, Crown, Shield, Swords, Zap, RotateCcw, Sparkles } from 'lucide-react'

type Props = { onExit: () => void; onWin?: () => void }
type Side = 'blue' | 'red'
type Power = { name: string; type: string; icon: string; strength: number; color: string; note: string }

const blueHeroes = [
  { name: 'NOVA', title: 'THE LIGHTNING STRIKER', image: '/images/fighters/blue-idle.png' },
  { name: 'VOLT', title: 'THE STORM WARRIOR', image: '/images/fighters/blue-idle.png' },
  { name: 'FROST', title: 'THE ICE GUARDIAN', image: '/images/fighters/blue-idle.png' },
]
const redHeroes = [
  { name: 'EMBER', title: 'THE FIRE CHAMPION', image: '/images/fighters/red-idle.png' },
  { name: 'HEX', title: 'THE SHADOW LORD', image: '/images/fighters/red-idle.png' },
  { name: 'SOLIS', title: 'THE SOLAR KNIGHT', image: '/images/fighters/red-idle.png' },
]
const powerPool: Power[] = [
  { name: 'THUNDER SPEAR', type: 'LIGHTNING', icon: 'ϟ', strength: 78, color: '#55c8ff', note: 'A focused bolt that pierces the arena.' },
  { name: 'INFERNO WAVE', type: 'FIRE', icon: '✦', strength: 86, color: '#ff754d', note: 'A sweeping wave of controlled flame.' },
  { name: 'FROST BREAKER', type: 'ICE', icon: '❄', strength: 72, color: '#8deaff', note: 'A freezing strike that slows the rival.' },
  { name: 'VOID CRUSH', type: 'SHADOW', icon: '◈', strength: 92, color: '#b58aff', note: 'A dense shadow blast with heavy impact.' },
  { name: 'SOLAR BURST', type: 'SOLAR', icon: '☼', strength: 88, color: '#ffd36c', note: 'A bright burst of concentrated energy.' },
  { name: 'WIND CUTTER', type: 'WIND', icon: '〰', strength: 66, color: '#a9e6cf', note: 'A fast pressure wave across the ground.' },
  { name: 'CRYSTAL GUARD', type: 'SHIELD', icon: '⬡', strength: 70, color: '#83c9ff', note: 'A defensive wall that absorbs impact.' },
  { name: 'METEOR KICK', type: 'IMPACT', icon: '✹', strength: 82, color: '#ff9b70', note: 'A high-speed physical finisher.' },
  { name: 'PLASMA ORB', type: 'PLASMA', icon: '●', strength: 80, color: '#76a9ff', note: 'A compact energy orb with a sharp hit.' },
  { name: 'PHANTOM DASH', type: 'SPEED', icon: '➤', strength: 75, color: '#d0a8ff', note: 'A sudden dash followed by a clean strike.' },
]
function shufflePowers(): Power[] {
  const pool = [...powerPool]
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]] }
  return pool.slice(0, 5)
}

export default function SuperheroClash({ onExit, onWin }: Props) {
  const [blueHero, setBlueHero] = useState(0)
  const [redHero, setRedHero] = useState(0)
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<'select' | 'p1' | 'p2' | 'ready' | 'clash' | 'result' | 'finished'>('select')
  const [bluePowers, setBluePowers] = useState<Power[]>([])
  const [redPowers, setRedPowers] = useState<Power[]>([])
  const [bluePick, setBluePick] = useState<number | null>(null)
  const [redPick, setRedPick] = useState<number | null>(null)
  const [blueHealth, setBlueHealth] = useState(100)
  const [redHealth, setRedHealth] = useState(100)
  const [winner, setWinner] = useState<Side | null>(null)
  const [lastHit, setLastHit] = useState('')
  const [clashId, setClashId] = useState(0)
  const [impactSide, setImpactSide] = useState<Side | null>(null)
  const [attackWinner, setAttackWinner] = useState<Side | null>(null)

  const blue = blueHeroes[blueHero], red = redHeroes[redHero]
  const bluePower = bluePick === null ? null : bluePowers[bluePick]
  const redPower = redPick === null ? null : redPowers[redPick]

  const begin = () => {
    setBlueHealth(100); setRedHealth(100); setRound(1); setWinner(null); setLastHit('')
    setBluePowers(shufflePowers()); setRedPowers(shufflePowers()); setBluePick(null); setRedPick(null); setImpactSide(null); setAttackWinner(null); setPhase('p1')
  }
  const choose = (side: Side, index: number) => {
    if (side === 'blue' && phase === 'p1') { setBluePick(index); setPhase('p2') }
    if (side === 'red' && phase === 'p2') { setRedPick(index); setPhase('ready') }
  }
  const resolve = () => {
    if (!bluePower || !redPower) return
    setPhase('clash'); setClashId(v => v + 1)
    const bRoll = bluePower.strength * (0.82 + Math.random() * 0.36)
    const rRoll = redPower.strength * (0.82 + Math.random() * 0.36)
    const bWins = bRoll >= rRoll
    const damage = Math.max(8, Math.min(25, Math.round(Math.abs(bRoll - rRoll) * 0.48 + 9)))
    const nextBlue = Math.max(0, blueHealth - (bWins ? 0 : damage))
    const nextRed = Math.max(0, redHealth - (bWins ? damage : 0))
    const message = bWins ? `${bluePower.name} OVERPOWERS ${redPower.name}` : `${redPower.name} BREAKS THROUGH ${bluePower.name}`
    setImpactSide(bWins ? 'red' : 'blue')
    setAttackWinner(bWins ? 'blue' : 'red')
    window.setTimeout(() => {
      setBlueHealth(nextBlue); setRedHealth(nextRed); setLastHit(message)
      if (nextBlue <= 0 || nextRed <= 0) { const winSide: Side = nextBlue > nextRed ? 'blue' : 'red'; setWinner(winSide); setPhase('finished'); onWin?.() }
      else setPhase('result')
    }, 2050)
  }
  const nextRound = () => {
    setRound(v => v + 1); setBluePowers(shufflePowers()); setRedPowers(shufflePowers()); setBluePick(null); setRedPick(null); setImpactSide(null); setAttackWinner(null); setLastHit(''); setPhase('p1')
  }
  const reset = () => { setPhase('select'); setWinner(null); setImpactSide(null); setAttackWinner(null); setBlueHealth(100); setRedHealth(100) }

  return <main className="gsh-screen gsh-real-game gsh-clean-clash">
    <header className="gsh-back-row"><button onClick={onExit}><ArrowLeft size={17}/> EXIT ARENA</button><div className="gsh-brand"><Crown size={18}/> GLOBAL SUPER HERO</div><span className="gsh-round-tag">2 PLAYER · POWER CLASH</span></header>

    {phase === 'select' && <section className="gc-select">
      <div className="gc-kicker">THE ARENA IS READY</div><h1>CHOOSE YOUR CHAMPIONS</h1><p>Two heroes enter. Every round brings five new powers. Choose wisely.</p>
      <div className="gc-select-grid">
        <article className="gc-hero-card blue"><div className="gc-player-label">PLAYER 1</div><img src={blue.image} alt="Blue hero"/><h2>{blue.name}</h2><span>{blue.title}</span><div className="gc-hero-switch">{blueHeroes.map((h, i) => <button key={h.name} className={blueHero === i ? 'active' : ''} onClick={() => setBlueHero(i)}>{h.name}</button>)}</div></article>
        <div className="gc-vs">VS</div>
        <article className="gc-hero-card red"><div className="gc-player-label">PLAYER 2</div><img src={red.image} alt="Red hero"/><h2>{red.name}</h2><span>{red.title}</span><div className="gc-hero-switch">{redHeroes.map((h, i) => <button key={h.name} className={redHero === i ? 'active' : ''} onClick={() => setRedHero(i)}>{h.name}</button>)}</div></article>
      </div>
      <button className="gc-primary" onClick={begin}>ENTER THE ARENA <Swords size={19}/></button>
    </section>}

    {phase !== 'select' && <section className="gc-game">
      <div className="gc-top-hud">
        <div className="gc-hud-side blue"><div><small>PLAYER 1</small><strong>{blue.name}</strong></div><div className="gc-health"><i style={{ width: `${blueHealth}%` }}/></div><b>{blueHealth}%</b></div>
        <div className="gc-round"><small>ROUND</small><strong>{round.toString().padStart(2, '0')}</strong></div>
        <div className="gc-hud-side red"><div><small>PLAYER 2</small><strong>{red.name}</strong></div><div className="gc-health"><i style={{ width: `${redHealth}%` }}/></div><b>{redHealth}%</b></div>
      </div>

      <div className={`gc-stage ${phase === 'clash' ? `is-clashing dominant-${attackWinner}` : ''} ${phase === 'result' ? `impact-${impactSide}` : ''}`} key={clashId}>
        <div className="gc-arena-backdrop"><img src="/images/arena-background.png" alt="Grand championship arena"/><div className="gc-arena-vignette"/><div className="gc-floor-ring ring-one"/><div className="gc-floor-ring ring-two"/></div>
        {phase === 'clash' && <>
          <PowerBlast side="blue" power={bluePower} winner={attackWinner} />
          <PowerBlast side="red" power={redPower} winner={attackWinner} />
          <div className="gc-impact"><i/><b>CLASH!</b><i/></div>
        </>}
        <div className={`gc-fighter blue ${phase === 'clash' ? 'blue-attack' : phase === 'result' && impactSide === 'blue' ? 'blue-hurt' : phase === 'finished' && winner === 'red' ? 'blue-fall' : ''}`}>
          <img src={`/images/fighters/blue-${phase === 'clash' ? (bluePower?.type === 'IMPACT' ? 'kick' : 'punch') : phase === 'result' && impactSide === 'blue' ? 'hurt' : phase === 'finished' && winner === 'red' ? 'down' : 'idle'}.png`} alt={`${blue.name} fighter animation`} />
          <span>{blue.name}</span>
        </div>
        <div className={`gc-fighter red ${phase === 'clash' ? 'red-attack' : phase === 'result' && impactSide === 'red' ? 'red-hurt' : phase === 'finished' && winner === 'blue' ? 'red-fall' : ''}`}>
          <img src={`/images/fighters/red-${phase === 'clash' ? (redPower?.type === 'IMPACT' ? 'kick' : 'punch') : phase === 'result' && impactSide === 'red' ? 'hurt' : phase === 'finished' && winner === 'blue' ? 'down' : 'idle'}.png`} alt={`${red.name} fighter animation`} />
          <span>{red.name}</span>
        </div>
        {(phase === 'result' || phase === 'finished') && <div className="gc-result-banner"><strong>{phase === 'finished' ? `${winner === 'blue' ? blue.name : red.name} WINS!` : lastHit}</strong><span>{phase === 'finished' ? 'ARENA CHAMPION' : 'POWER COLLISION COMPLETE'}</span></div>}
      </div>

      <div className="gc-turn-status">
        {phase === 'p1' && <><span className="gc-dot blue-dot"/> PLAYER 1 — CHOOSE A NUMBER</>}
        {phase === 'p2' && <><span className="gc-dot red-dot"/> PLAYER 2 — YOUR TURN. PLAYER 1'S PICK IS HIDDEN.</>}
        {phase === 'ready' && <><Sparkles size={16}/> BOTH POWERS LOCKED — READY TO REVEAL?</>}
        {phase === 'clash' && <><Zap size={16}/> POWER RELEASED — WATCH THE ARENA COLLISION</>}
        {phase === 'result' && <><Shield size={16}/> ROUND COMPLETE — CHOOSE AGAIN</>}
        {phase === 'finished' && <><Crown size={16}/> BATTLE FINISHED</>}
      </div>

      {(phase === 'p1' || phase === 'p2' || phase === 'ready') && <div className="gc-pick-panels">
        <PowerPicker side="blue" powers={bluePowers} selected={phase === 'p2' || phase === 'ready' ? null : bluePick} active={phase === 'p1'} locked={bluePick !== null} onChoose={i => choose('blue', i)} />
        <div className="gc-middle-action">
          <div className="gc-lock-state">{bluePick === null ? 'P1 WAITING' : 'P1 LOCKED'}<span>{redPick === null ? 'P2 WAITING' : 'P2 LOCKED'}</span></div>
          {phase === 'ready' && <button className="gc-primary gc-reveal" onClick={resolve}>REVEAL &amp; CLASH <Swords size={18}/></button>}
          {phase !== 'ready' && <div className="gc-vs-mini">VS</div>}
        </div>
        <PowerPicker side="red" powers={redPowers} selected={phase === 'ready' ? null : redPick} active={phase === 'p2'} locked={redPick !== null} onChoose={i => choose('red', i)} />
      </div>}
      {(phase === 'clash' || phase === 'result' || phase === 'finished') && <div className="gc-reveal-row">
        <div className="gc-revealed blue"><small>NOVA'S POWER</small><strong><em>{bluePower?.icon}</em>{bluePower?.name}</strong><span>{bluePower?.note}</span></div>
        <div className="gc-revealed red"><small>EMBER'S POWER</small><strong><em>{redPower?.icon}</em>{redPower?.name}</strong><span>{redPower?.note}</span></div>
      </div>}
      {phase === 'result' && <button className="gc-primary gc-next" onClick={nextRound}>NEXT ROUND <Zap size={18}/></button>}
      {phase === 'finished' && <div className="gc-finish-actions"><button className="gc-primary" onClick={begin}><RotateCcw size={17}/> REMATCH</button><button className="gc-secondary" onClick={reset}>CHANGE HEROES</button></div>}
      <div className="gc-footnote">POWER SLOTS SHUFFLE EVERY ROUND <span>·</span> NO KEYBOARD REQUIRED <span>·</span> FIRST TO ZERO HEALTH LOSES</div>
    </section>}
  </main>
}

function PowerPicker({ side, powers, selected, active, locked, onChoose }: { side: Side; powers: Power[]; selected: number | null; active: boolean; locked: boolean; onChoose: (i: number) => void }) {
  return <div className={`gc-picker ${side} ${active ? 'is-active' : ''} ${locked ? 'is-locked' : ''}`}>
    <div className="gc-picker-head"><strong>{side === 'blue' ? 'PLAYER 1' : 'PLAYER 2'}</strong><span>{locked ? 'POWER LOCKED' : active ? 'SELECT ONE POWER' : 'WAITING'}</span></div>
    <div className="gc-power-grid">{powers.map((power, i) => <button key={`${power.name}-${i}`} disabled={!active || locked} className={selected === i ? 'chosen' : ''} onClick={() => onChoose(i)}><b>{i + 1}</b><span style={{ color: power.color }}>{power.icon}</span><small>{locked && selected === i ? 'LOCKED' : `POWER ${i + 1}`}</small></button>)}</div>
    {locked && selected !== null && <div className="gc-choice-confirm">SELECTION LOCKED · HIDDEN UNTIL REVEAL</div>}
  </div>
}


function PowerBlast({ side, power, winner }: { side: Side; power: Power | null; winner: Side | null }) {
  if (!power) return null
  const dominance = winner === side ? 'is-dominant' : 'is-overpowered'
  return <div className={`gc-blast ${side} ${dominance} power-${power.type.toLowerCase()}`} aria-label={`${power.name} attack effect`}>
    <span className="gc-blast-core" />
    <span className="gc-blast-trail" />
    <span className="gc-blast-particles" />
    <span className="gc-blast-sparks" />
  </div>
}
