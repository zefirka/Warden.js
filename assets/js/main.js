hljs.initHighlightingOnLoad();
$('pre code').each(function(i, block) {
	hljs.highlightBlock(block);
});

$(function(){
	var max =  $(Warden.Utils.reduce($("[eqz]"), function(a, b){
		return $(a).height() > $(b).height() ? $(a) : $(b)
	})).height();

	$("[eqz]").height(max);


	$("#submenu li").each(function(){
		if(location.pathname.split('/').pop() == $(this).find('a').attr('href')){
			$(this).addClass('active');
		}else{
			$(this).removeClass('active');
		}
	});
});

