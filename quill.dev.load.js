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

  ['link'],

  ['clean'],                                         // remove formatting button
  ['locked', 'condition']
];

window.quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

let delta = {
  "ops": [
    {"insert": "Toto je v podminenem bloku "},
    {"insert": "\n", "attributes": {"condition": { "id": "abcd123", "name": "variable1"}, "locked": {"contenteditable": "false"}}},
    {"insert": " a tohle taky."},
    {"insert": "\n", "attributes": {"condition": { "id": "abcd123", "name": "variable1"}}},
    {"insert": "\n"},
    {"insert": " Ted mam otevreny command dummyContainer a jak pisu dal, tak se to porad vklada."},
    {"insert": "\n", "attributes": {"condition": { "id": "xyzz444", "name": "variable2"}}},
  ]
};

quill.setContents(delta);

setInterval(
  function() {
    document.getElementById(
      'output_delta'
    ).value = stringify(quill.editor.getDelta(), {
      maxLength: 110,
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
