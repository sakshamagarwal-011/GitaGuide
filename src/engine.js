const themes = [
 {pattern:/anxious|anxiety|worry|worried|future|stress|control|result|outcome|failure|exam|success|attachment|let go/,ids:['2.47','2.48'],explanation:'These verses distinguish the work you can undertake from the results you cannot fully command. They also caution against withdrawing into inaction. One possible application is to choose a worthwhile next step and give it your attention, while acknowledging that its outcome is uncertain.',reflection:'What is one useful action you can take today, even without a guarantee of success?'},
 {pattern:/decision|career|job|purpose|crossroad|duty|calling|comparison|compare/,ids:['3.35','2.47'],explanation:'These verses invite reflection on your own responsibilities and on acting without making the reward your only motive. They do not decide a modern career choice for you. A possible application is to consider what your responsibilities, abilities, and circumstances call for, rather than simply copying another person’s path.',reflection:'Which option lets you act responsibly in your actual circumstances?'},
 {pattern:/anger|angry|patience|react|resent|jealous|rage/,ids:['2.62','2.63'],explanation:'These verses describe a sequence from dwelling on objects to attachment, desire, anger, and loss of discernment. One possible application is to notice the expectation behind a strong reaction and create a pause before acting on it.',reflection:'What expectation might be feeding the anger, and what could help you pause?'},
 {pattern:/focus|distract|meditat|restless|mind|concentrat/,ids:['6.26','6.35'],explanation:'These verses acknowledge that the mind wanders and is difficult to restrain, while emphasizing returning it through practice. A possible application is to return your attention gently when you notice distraction, without treating each distraction as a failure.',reflection:'What small, repeatable practice could help you return your attention?'},
 {pattern:/relationship|friend|compassion|kind|forgive|hate|love|family/,ids:['12.13','12.14'],explanation:'These verses describe qualities of devotion that include friendliness, compassion, and steadiness. One possible application is to approach a difficult interaction with care while reflecting on your own response. These verses alone do not settle whether a particular relationship is safe or healthy.',reflection:'What would a compassionate and considered response look like here?'},
 {pattern:/change|loss|sad|pain|grief|sorrow|difficult|hardship/,ids:['2.14','2.15'],explanation:'These verses speak of changing experiences of pleasure and pain and of steadiness amid them. One possible application is to acknowledge a difficult feeling without assuming it will always remain the same. This does not require denying grief or facing hardship without support.',reflection:'What support or steady practice would help you move through this moment?'}
];
const stop=new Set('i me my myself we our you your it its a an the is are was were be been to of in for on and or but do does how what why can could should would with that this about as at from have has am im feel feeling please tell more'.split(' '));
export function tokens(text){return String(text).toLowerCase().match(/[a-z]+/g)?.filter(w=>w.length>2&&!stop.has(w))||[]}
export function retrieve(query,verses,previous=''){
 const exact=query.match(/(?:chapter\s*)?(\d{1,2})\s*(?:[.:]|,?\s+verse\s+)\s*(\d{1,3})/i);
 if(exact)return {verses:verses.filter(v=>v.id===`${+exact[1]}.${+exact[2]}`),theme:null,exact:true};
 const follow=/^(more|another|how (?:does|can|do)|what about|explain|apply|tell me more|and )/i.test(query.trim());
 const context=follow?`${previous} ${query}`:query;
 const theme=themes.find(t=>t.pattern.test(context.toLowerCase()));
 const q=[...new Set(tokens(context))];
 const docs=verses.map(v=>tokens(v.english));const avg=docs.reduce((a,d)=>a+d.length,0)/docs.length;
 const df=Object.fromEntries(q.map(w=>[w,docs.filter(d=>d.includes(w)).length]));
 const ranked=verses.map((v,i)=>({v,score:q.reduce((sum,w)=>{const tf=docs[i].filter(x=>x===w).length;return sum+Math.log(1+(verses.length-df[w]+.5)/(df[w]+.5))*tf*2.2/(tf+1.2*(.25+.75*docs[i].length/avg));},0)})).filter(x=>x.score>2).sort((a,b)=>b.score-a.score);
 if(theme)return {verses:theme.ids.map(id=>verses.find(v=>v.id===id)).filter(Boolean),theme,exact:false};
 return {verses:ranked.slice(0,3).map(x=>x.v),theme:null,exact:false};
}
export function safetyResponse(query){
 if(/suicid|kill myself|end my life|end it all|hurt myself|self.?harm|don.t want to (?:live|be alive)|want to die|better off dead/i.test(query))return 'I’m sorry you’re facing this. Your safety matters. If you might act on these feelings now, contact your local emergency number or go to the nearest emergency department. If possible, move away from anything you could use to hurt yourself and reach out to someone you trust who can stay with you. You can find a local crisis helpline at https://findahelpline.com. Are you in immediate danger right now?';
 if(/kill (?:him|her|them|someone)|hurt (?:him|her|them|someone)|attack someone/i.test(query))return 'If you feel close to hurting someone, put distance between yourself and that person and move away from weapons or other dangerous objects. Contact local emergency services if there is immediate danger, or reach out to someone you trust for support now. Spiritual reflection should not be used to justify harm.';
 return null;
}
export function fallback(result){
 if(!result.verses.length)return {text:'I couldn’t find a sufficiently clear verse match. Could you share a little more about the situation, or try a topic such as attachment, anger, duty, or the restless mind?',reflection:null};
 if(result.exact)return {text:'Here is the requested verse from the source collection. Read it in its chapter context and take time to consider its meaning.',reflection:null};
 if(result.theme)return {text:result.theme.explanation,reflection:result.theme.reflection};
 return {text:'These verses share words with your question and may offer a starting point for reading. A keyword match does not establish that a teaching applies to your situation. I’m showing source text rather than claiming a personalized interpretation.',reflection:'Which part of these verses connects with what you are experiencing?'};
}
