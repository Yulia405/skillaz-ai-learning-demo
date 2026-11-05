export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const icon=(name,cls='')=>`<img class="icon ${cls}" src="assets/${name}.svg" alt="">`;
export const btn=(label,action,kind='',extra='')=>`<button class="btn ${kind}" data-action="${action}" ${extra}>${label}</button>`;
export const ibtn=(name,action,title,extra='')=>`<button class="icon-btn" data-action="${action}" title="${title}" aria-label="${title}" ${extra}>${icon(name)}</button>`;
export const link=(label,path,cls='')=>`<a class="${cls}" href="#${path}">${label}</a>`;
export const field=(id,label,value='',opts={})=>`<div class="field"><label for="${id}">${label}${opts.required?' <span class="required">*</span>':''}</label>${opts.area?`<textarea id="${id}" data-bind="${id}" ${opts.required?'required':''}>${esc(value)}</textarea>`:`<input class="input" id="${id}" data-bind="${id}" value="${esc(value)}" ${opts.required?'required':''}>`}<div class="field-error" data-error="${id}"></div>${opts.hint?`<p class="hint">${opts.hint}</p>`:''}</div>`;
export const empty=(title,text,action='')=>`<div class="empty"><h2>${title}</h2><p class="muted">${text}</p>${action}</div>`;
export const notice=(text,kind='')=>`<div class="notice ${kind}" role="status">${text}</div>`;
export const search=(value,id,placeholder)=>`<label class="search">${icon('magnifier-outlined')}<input id="${id}" type="search" value="${esc(value)}" aria-label="${placeholder}" placeholder="${placeholder}"></label>`;
