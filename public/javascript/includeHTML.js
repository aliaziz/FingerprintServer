function includeHTML() {
  $(document).ready(function() {
		$('#tabsLink').load('/fingerprintCore/tabsLink.html');
/* 		$('#linksHeader a').on('click', function (e) {
			e.preventDefault()
			$(this).tab('show')
		});
		$('#myCollapse').on('show', function (e) {
			$(this).tab('show')
		}); */
		 $("li").click(function(){
			$("a").addClass("active");
		});
	});
}

includeHTML();