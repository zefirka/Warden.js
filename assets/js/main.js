hljs.initHighlightingOnLoad();
$('pre code').each(function(i, block) {
	hljs.highlightBlock(block);
});

function fn_active(el){
	if(location.pathname.split('/').pop() == el.find('a').attr('href')){
		el.addClass('active');
	}else{
		el.removeClass('active');
	}
}

$(function(){
	$("#submenu li").each(function(){
		fn_active($(this));
	});

	$("nav li").each(function(){
		fn_active($(this));
	});
});

