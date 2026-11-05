import {seed,COURSE,uploads,prepareStructure,saveDraft,answer,practiceFeedback} from './model.js';
export const sceneRoutes={
 'author-list':'/editor/courses','author-new':'/editor/courses','author-materials':'/editor/courses/demo-course/lectures','author-sources':'/editor/courses/demo-course/lectures','author-search':'/editor/courses/demo-course/lectures','author-structure':'/editor/courses/demo-course/lectures','author-recommendation':'/editor/courses/demo-course/lectures','author-added':'/editor/courses/demo-course/lectures','author-review':'/editor/courses/demo-course/lectures','author-saved':'/editor/courses/demo-course/lectures','author-manual':'/editor/courses/demo-course/lectures',
 'tutor-topic-prompt':'/catalog','tutor-topic-result':'/catalog','tutor-course':'/learning/course/101','tutor-course-picker':'/learning/course/101','tutor-context-change':'/learning/play/101?item=status','tutor-context-confirm':'/learning/play/101?item=status','tutor-video':'/learning/play/101?item=video','tutor-scorm':'/learning/play/101?item=scorm','tutor-related':'/catalog',
 'tutor-start':'/catalog','tutor-search':'/catalog','tutor-source':'/learning/play/101?item=expert','tutor-explain':'/learning/play/101?item=expert','tutor-example':'/learning/play/101?item=expert','tutor-practice':'/learning/play/101?item=expert','tutor-feedback':'/learning/play/101?item=expert','tutor-new':'/learning/play/101?item=expert','tutor-history':'/learning/play/101?item=expert','tutor-test':'/learning/play/101?item=test','tutor-revoked':'/learning/play/101?item=expert'
};
export const sceneActions={
 'author-new':[{action:'create-menu'}],
 'author-search':[{action:'library-ai'},{field:'library-query',value:'работа с обращениями клиентов'},{action:'library-search'}],
 'author-recommendation':[{action:'recommend-library',id:'check'}],
 'tutor-topic-prompt':[{action:'quick-understand'}],
 'tutor-course':[{action:'quick-understand'}],
 'tutor-course-picker':[{action:'choose-course-material'}],
 'tutor-history':[{action:'history'}]
};
export function sceneState(name,role='employee'){
 const s=seed();s.role=role;s.courseWorkspaces={};s.chatArchive=[];
 if(!name)return s;
 if(name.startsWith('author-')&&!['author-list','author-new'].includes(name)){
  const a=s.author;Object.assign(a,{workspaceId:'demo-course',name:COURSE,audience:'Сотрудники первой линии поддержки',objective:'Зарегистрировать обращение, подготовить сложный случай и передать его эксперту',step:'sources'});s.context='author';
  if(name!=='author-materials'){a.files=[structuredClone(uploads[0])];a.selectedLibrary=['lib-video'];}
  if(!['author-materials','author-sources','author-search'].includes(name))prepareStructure(a);
  if(['author-added','author-review','author-saved'].includes(name)){
   a.groups.push({id:'g-check',name:'Проверка знаний'});a.selectedLibrary.push('lib-test');
   a.blocks.push({id:'lib-test',libraryId:'lib-test',existing:true,type:'test',group:'g-check',name:'Работа с обращениями: проверка знаний',text:'Готовый тест по правилам регистрации и передачи обращений.',source:'Редактор',accepted:true,reason:'Раздел выбран автором'});a.expandedElement='lib-test';
  }
  if(name==='author-review')a.step='review';
  if(name==='author-saved'){a.blocks.forEach(b=>b.accepted=true);saveDraft(s);}
  if(name==='author-manual'){a.files=[];a.selectedLibrary=[];a.groups=[{id:'manual',name:'Первый день на линии'}];a.blocks=[{id:'manual-text',group:'manual',name:'Моя памятка для первой линии',type:'article',text:'Перед началом смены проверьте доступ к журналу обращений. Мой авторский текст сохраняется при дополнении курса.',accepted:true,manual:true,source:'Добавлено автором'}];a.keepOutline=true;a.step='structure';}
  s.courseWorkspaces[a.workspaceId]=structuredClone(a);
 }
 if(name.startsWith('tutor-')){
  s.panel=true;s.contextInitialized=true;s.context=['tutor-start','tutor-search'].includes(name)?'catalog':'expert';
  const q='Как передать сложное обращение эксперту?',chat=[{role:'user',text:q},{role:'assistant',...answer(s,q,'catalog')}];
  if(name!=='tutor-start')s.chats[s.context]=structuredClone(chat);
  if(['tutor-explain','tutor-example','tutor-practice','tutor-feedback'].includes(name))s.chats.expert=[{role:'user',text:'Объясни проще, что подготовить перед передачей'},{role:'assistant',...answer(s,'Объясни проще','expert')}];
  if(name==='tutor-example')s.chats.expert.push({role:'user',text:'Приведи учебный пример'},{role:'assistant',...answer(s,'Приведи пример','expert')});
  if(['tutor-practice','tutor-feedback'].includes(name)){const reply=answer(s,'Давай потренируемся','expert');if(name==='tutor-feedback'){const text='Передам описание ошибки и то, что уже проверил.',f=practiceFeedback(text);reply.attempt={text,complete:f.complete,feedback:f.text};}s.chats.expert=[{role:'user',text:'Хочу потренироваться'},{role:'assistant',...reply}];}
  if(['tutor-new','tutor-history'].includes(name)){s.chatArchive=[{id:'history-demo',context:'expert',messages:chat,title:q,date:'Сегодня'}];s.chats.expert=[];}
  if(name==='tutor-test'){s.context='test';s.test.status='active';s.chats.test=[];}
  if(name==='tutor-revoked')s.scenario='revoked';
  if(name==='tutor-source'){s.context='expert';s.chats.expert=[];}
  if(name==='tutor-topic-prompt'){s.context='catalog';s.chats={};s.tutorIntent='understand';s.topicPrompt='Что хотите понять? Напишите тему или вопрос — найду объяснение в доступных материалах.';}
  if(name==='tutor-topic-result'){s.context='catalog';s.tutorIntent='understand';s.chats={catalog:[{role:'user',text:'Когда нужно передавать обращение эксперту?'},{role:'assistant',...answer(s,'Когда нужно передавать обращение эксперту?','catalog')}]};}
  if(['tutor-course','tutor-course-picker'].includes(name)){s.context='course:101';s.chats={};s.tutorIntent='understand';s.topicPrompt='Какую тему или материал курса хотите разобрать?';}
  if(name==='tutor-context-change'){s.context='expert';s.chats={expert:[{role:'user',text:'Объясни этот материал'},{role:'assistant',...answer(s,'Объясни этот материал','expert')}]};}
  if(name==='tutor-context-confirm'){s.context='status';s.chats={status:[]};s.chatArchive=[{id:'previous-material',context:'expert',messages:chat,title:q,date:'Сегодня'}];}
  if(['tutor-video','tutor-scorm'].includes(name)){s.context=name==='tutor-video'?'video':'scorm';s.chats={};}
  if(name==='tutor-related'){s.context='catalog';s.tutorIntent='find';s.chats={catalog:[{role:'user',text:'Найди текстовые материалы по теме обращения клиентов'},{role:'assistant',...answer(s,'Найди текстовые материалы по теме обращения клиентов','catalog')}]};}

 }
 return s;
}
