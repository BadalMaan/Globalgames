import fs from 'node:fs'
const file=process.argv[2]||'content/question-bank-starter.json'
const items=JSON.parse(fs.readFileSync(file,'utf8'))
const counts=new Map(),duplicates=new Set(),seen=new Set(),errors=[]
for(const [i,q] of items.entries()){
 if(!q.game_id||!q.prompt||!q.answer||!Array.isArray(q.options)||q.options.length<2)errors.push(`Row ${i+1}: missing required question fields/options`)
 if(!q.options?.includes(q.answer))errors.push(`Row ${i+1}: answer is not in options`)
 const key=`${q.game_id}::${q.prompt.trim().toLowerCase()}`
 if(seen.has(key))duplicates.add(key);seen.add(key)
 counts.set(q.game_id,(counts.get(q.game_id)||0)+1)
}
console.log(`Loaded ${items.length} question records from ${file}`)
console.log('Question counts and initial 50-question target:')
for(const [game,count] of [...counts.entries()].sort())console.log(`  ${game}: ${count}/50 (${Math.max(0,50-count)} still needed)`)
if(duplicates.size)errors.push(`Duplicate prompts: ${[...duplicates].join(', ')}`)
if(errors.length){console.error('\\nStructural validation errors:');for(const e of errors)console.error(' - '+e);process.exitCode=1}
else console.log('\\nStructural validation passed. Quantity gaps above are still open. This does NOT verify Punjabi grammar, transliteration, spelling, matra classification, audio quality or pedagogical correctness. Teacher review is mandatory.')
