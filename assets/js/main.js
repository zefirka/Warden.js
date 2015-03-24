hljs.initHighlightingOnLoad();
$('pre code').each(function(i, block) {
	hljs.highlightBlock(block);
});

$(function(){
	$("#submenu li").each(function(){
		if(location.pathname.split('/').pop() == $(this).find('a').attr('href')){
			$(this).addClass('active');
		}else{
			$(this).removeClass('active');
		}
	});
});

