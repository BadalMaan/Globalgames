import { useState } from 'react'
import { ArrowLeft, RefreshCw, Swords, Trophy, Zap, Crown, Flame, Shield, Sparkles } from 'lucide-react'
import ThreeDuelScene from './ThreeDuelScene'

type Props={onExit:()=>void;onWin?:()=>void}
type HeroSide='blue'|'red'
const heroes={
 blue:[
  {name:'NOVA',title:'THE LIGHTNING STRIKER',image:'/images/hero-blue.png',power:'THUNDER BLAST',desc:'Launch a charged lightning sphere that knocks the enemy back.'},
  {name:'VOLT',title:'THE STORM WARRIOR',image:'/images/hero-blue.png',power:'PLASMA SHOCK',desc:'A fast energy projectile with a heavy impact.'},
  {name:'FROST',title:'THE ICE GUARDIAN',image:'/images/hero-blue.png',power:'GLACIER BURST',desc:'A freezing blast that interrupts the opponent.'}
 ],
 red:[
  {name:'EMBER',title:'THE FIRE CHAMPION',image:'/images/hero-red.png',power:'INFERNO BLAST',desc:'A blazing projectile with powerful knockback.'},
  {name:'HEX',title:'THE SHADOW LORD',image:'/images/hero-red.png',power:'VOID BURST',desc:'A dark energy orb that smashes through the arena.'},
  {name:'SOLIS',title:'THE SOLAR KNIGHT',image:'/images/hero-red.png',power:'SOLAR NOVA',desc:'A focused solar blast with explosive impact.'}
 ]
}
export default function SuperheroClash({onExit,onWin}:Props){
 const [stage,setStage]=useState<'select'|'battle'|'result'>('select')
 const [blue,setBlue]=useState(0),[red,setRed]=useState(0)
 const [winner,setWinner]=useState<HeroSide>('blue')
 const [blueName,setBlueName]=useState('NOVA'),[redName,setRedName]=useState('EMBER')
 const start=()=>{setBlueName(heroes.blue[blue].name);setRedName(heroes.red[red].name);setStage('battle')}
 const finish=(side:HeroSide)=>{setWinner(side);setStage('result');onWin?.()}
 const reset=()=>setStage('select')
 return <div className="gsh-screen gsh-real-game">
  <div className="gsh-back-row"><button onClick={stage==='battle'?onExit:onExit}><ArrowLeft size={17}/> EXIT ARENA</button><div className="gsh-brand"><Crown size={18}/> GLOBAL SUPER HERO</div><span className="gsh-round-tag">2 PLAYER · REAL-TIME FIGHT</span></div>
  {stage==='select'&&<div className="fighter-select">
   <div className="fighter-select-heading"><span>CHOOSE YOUR CHAMPIONS</span><h1>ENTER THE BATTLE ARENA</h1><p>Two players. One arena. Fight using your keyboard. Every punch, kick and power hits in real time.</p></div>
   <div className="fighter-select-grid">
    <section className="fighter-pick blue"><div className="fighter-pick-label">PLAYER 1 · BLUE TEAM</div><img src={heroes.blue[blue].image}/><h2>{heroes.blue[blue].name}</h2><strong>{heroes.blue[blue].title}</strong><div className="fighter-pick-power"><Zap size={18}/><b>{heroes.blue[blue].power}</b></div><p>{heroes.blue[blue].desc}</p><div className="fighter-pick-options">{heroes.blue.map((h,i)=><button className={blue===i?'selected':''} key={h.name} onClick={()=>{setBlue(i);setBlueName(h.name)}}>{h.name}</button>)}</div><input aria-label="Player 1 hero name" value={blueName} maxLength={18} onChange={e=>setBlueName(e.target.value.toUpperCase())}/></section>
    <div className="fighter-select-vs">VS</div>
    <section className="fighter-pick red"><div className="fighter-pick-label">PLAYER 2 · RED TEAM</div><img src={heroes.red[red].image}/><h2>{heroes.red[red].name}</h2><strong>{heroes.red[red].title}</strong><div className="fighter-pick-power"><Flame size={18}/><b>{heroes.red[red].power}</b></div><p>{heroes.red[red].desc}</p><div className="fighter-pick-options">{heroes.red.map((h,i)=><button className={red===i?'selected':''} key={h.name} onClick={()=>{setRed(i);setRedName(h.name)}}>{h.name}</button>)}</div><input aria-label="Player 2 hero name" value={redName} maxLength={18} onChange={e=>setRedName(e.target.value.toUpperCase())}/></section>
   </div>
   <div className="fighter-select-bottom"><div><Shield size={17}/> Special power recharges over time</div><button onClick={start}>START REAL FIGHT <Swords size={19}/></button></div>
  </div>}
  {stage==='battle'&&<div className="fighter-arena-wrap"><ThreeDuelScene blueName={blueName||heroes.blue[blue].name} redName={redName||heroes.red[red].name} blueImage={heroes.blue[blue].image} redImage={heroes.red[red].image} onWin={finish} onExit={onExit}/></div>}
  {stage==='result'&&<div className="fighter-result"><div className="fighter-result-icon"><Trophy size={62}/></div><span>ARENA CHAMPION</span><h1>{winner==='blue'?blueName:redName}</h1><h2>WINS THE BATTLE!</h2><p>{winner==='blue'?'Player 1 dominated the arena.':'Player 2 dominated the arena.'}</p><button onClick={reset}><RefreshCw size={18}/> FIGHT AGAIN</button><button className="fighter-exit" onClick={onExit}>BACK TO GAME ARENA</button></div>}
 </div>
}
