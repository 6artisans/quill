import stringify from 'json-stringify-pretty-compact';
import Quill from './quill'

let toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean'],                                         // remove formatting button
  ['create-dummy-container']
];

let quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

let toolbar = quill.getModule('toolbar');
toolbar.addHandler('create-dummy-container', function() {
  console.log('create-dummy-container')
});

var customButton = document.querySelector('.ql-create-dummy-container');
customButton.addEventListener('click', function() {
  // var range = quill.getSelection();
  // if (range) {
  //   quill.insertText(range.index, "Ω");
  // }
  console.log("kontejnéééér")
});

let delta = {
  "ops": [
    {"insert": "Toto je v podminenem bloku "},
    {"insert": "\n", "attributes": {"dummyContainer": "condition"}},
    {"insert": " a tohle taky."},
    {"insert": "\n", "attributes": {"dummyContainer": "condition"}},
    {"insert": "\n"},
    {"insert": " Ted mam otevreny command dummyContainer a jak pisu dal, tak se to porad vklada."},
    {"insert": "\n", "attributes": {"dummyContainer": "condition"}},
  ]
};

quill.setContents(delta);

setInterval(
  function() {
    document.getElementById(
      'output_delta'
    ).value = stringify(quill.editor.getDelta(), {
      maxLength: 80,
      indent: 2,
    });
  },
  500
);
setInterval(
  function() {
    document.getElementById('output_html').value = quill.root.innerHTML
  },
  500
);
