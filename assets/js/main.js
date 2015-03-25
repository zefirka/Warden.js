hljs.initHighlightingOnLoad();
$('pre code').each(function(i, block) {
	hljs.highlightBlock(block);
});

function fn_active(el, alter){
	var href = el.find('a').attr('href');
	if(location.pathname.split('/').pop() == href || (alter && href.indexOf(alter) >= 0)){
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
		fn_active($(this), $("#active_tab").val());
	});	
});

