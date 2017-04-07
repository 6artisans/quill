import stringify from 'json-stringify-pretty-compact';

window.quillTable = quill => {
  // TableHandler module
  // let TableHandler = quill.getModule('table_handler');
  //
  // // Adding random IDs for clipboard table - is parsing always sequential?
  // let table_id = TableHandler.randomId();
  // let row_id = TableHandler.randomId();
  // quill.clipboard.addMatcher('TABLE', function(node, delta) {
  //   console.log(node);
  //   table_id = TableHandler.randomId();
  //   return delta;
  // });
  // quill.clipboard.addMatcher('TR', function(node, delta) {
  //   console.log(node);
  //   row_id = TableHandler.randomId();
  //   return delta;
  // });
  // quill.clipboard.addMatcher('TD', function(node, delta) {
  //   console.log(node);
  //   let cell_id = TableHandler.randomId();
  //   return delta.compose(
  //     new Delta().retain(delta.length(), {
  //       td: table_id + '|' + row_id + '|' + cell_id,
  //     })
  //   );
  // });

  let delta = {
    ops: [
      { insert: 'ahoj ' },
      { insert: '\n', attributes: { dummyContainer: 'id' } },
      { insert: ' je text\n' },
    ],
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
      document.getElementById('output_html').value = quill.root.innerHTML;
    },
    500
  );
};
