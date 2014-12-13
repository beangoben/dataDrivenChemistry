IPython.Cell.options_default.cm_config.lineNumbers = true;


require(["/static/custom/nbextensions/toc.js"], function (toc) {
	console.log('Table of Contents extension loaded');
	toc.load_ipython_extension();
	$([IPython.events]).on("notebook_loaded.Notebook", toc.table_of_contents);
});
 
IPython.load_extensions('toc');
