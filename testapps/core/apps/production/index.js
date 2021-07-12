import { Tolgee } from '@tolgee/core';

document.body = document.createElement('body');
const htmlElement = document.createElement('div');
document.body.append(htmlElement);

const initialTextsToTranslate = document.createElement('div');
initialTextsToTranslate.innerHTML =
  '<p>{{test}}</p><p>{{test}}</p><p>{{test_param:param:value}}</p><p>{{test}}</p>';
document.body.append(initialTextsToTranslate);

const tolgee = new Tolgee({
  watch: true,
  inputPrefix: '{{',
  inputSuffix: '}}',
});
tolgee.lang = 'en';
tolgee.onLangLoaded.subscribe(() => {
  refresh();
});

const refresh = () =>
  tolgee.translate('test').then((t) => {
    htmlElement.innerHTML = '';
    htmlElement.append(t);
    const p = document.createElement('p');
    window.setLang = (lang) => (tolgee.lang = lang);
    p.innerHTML =
      '<button onclick=\'window.setLang("cs")\'>cs</button>' +
      '<button onclick=\'window.setLang("en")\'>en</button>';

    htmlElement.append(p);
  });

refresh();
tolgee.run();
