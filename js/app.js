/* eslint-disable */
var customSearch;
(function ($) {

	"use strict";
	const scrollCorrection = 70; // (header height = 50px) + (gap = 20px)
	const clientW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
	const sideH = $('.l_side').height();
	const el_toc = $('.toc-wrapper');
	const el_toc_v = $('.toc-wrapper-vdom');
	let sideH_flag = true;
	let visible_flag = clientW <= 820 ? 'none' : 'block';
	//1090 = 820(@on-phone) + 250(@side-width) + 20 (@gap)

	el_toc.css({
		'top': sideH,
		'display': visible_flag
	})
	el_toc_v.css({
		'top': 90
	})

	function scrolltoElement(elem, correction) {
		correction = correction || scrollCorrection;
		const $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
		$('html, body').animate({ 'scrollTop': $elem.offset().top - correction }, 400);
	};

	function setHeader() {
		if (!window.subData) return;
		const $wrapper = $('header .wrapper');
		const $comment = $('.s-comment', $wrapper);
		const $toc = $('.s-toc', $wrapper);
		const $top = $('.s-top',$wrapper);

		$wrapper.find('.nav-sub .logo').text(window.subData.title);
		let pos = document.body.scrollTop;
		$(document, window).scroll(() => {
			const scrollTop = $(window).scrollTop();
			const del = scrollTop - pos;
			const offsetH = $('.toc-wrapper').length && $('.toc-wrapper').get(0).getBoundingClientRect().top;
			const docScrollTop = $(document).scrollTop();
			if (del >= 20) {
				pos = scrollTop;
				$wrapper.addClass('sub');
			} else if (del <= -20) {
				pos = scrollTop;
				$wrapper.removeClass('sub');
			}
			if(offsetH < 70 && sideH_flag && visible_flag === 'block') {
				sideH_flag = false;
				el_toc.hide();
				el_toc_v.show();
				el_toc_v.css('transform', 'perspective(1500px) translateZ(50px)');
				// 使dom变换更加平滑
			}
			if(docScrollTop < 660 && !sideH_flag && docScrollTop > 10 && visible_flag === 'block') {
				sideH_flag = true;
				el_toc.show();
				el_toc_v.hide();
			}
		});
		// bind events to every btn
		const $commentTarget = $('#comments');
		if ($commentTarget.length) {
			$comment.click(e => { e.preventDefault(); e.stopPropagation(); scrolltoElement($commentTarget); });
		} else $comment.remove();

		const $tocTarget = $('.toc-wrapper');
		if ($tocTarget.length && $tocTarget.children().length) {
			$toc.click((e) => { e.stopPropagation(); $tocTarget.toggleClass('active'); });
		} else $toc.remove();

		const $tocTarget2 = $('.toc-wrapper-vdom');
		if ($tocTarget2.length && $tocTarget2.children().length) {
			$toc.click((e) => { e.stopPropagation(); $tocTarget2.toggleClass('active'); });
		} else $toc.remove();

		$top.click(()=>scrolltoElement(document.body));

	}
	function setHeaderMenu() {
		var $headerMenu = $('header .menu');
		var $underline = $headerMenu.find('.underline');
		function setUnderline($item, transition) {
			$item = $item || $headerMenu.find('li a.active');//get instant
			transition = transition === undefined ? true : !!transition;
			if (!transition) $underline.addClass('disable-trans');
			if ($item && $item.length) {
				$item.addClass('active').siblings().removeClass('active');
				$underline.css({
					left: $item.position().left,
					width: $item.innerWidth()
				});
			} else {
				$underline.css({
					left: 0,
					width: 0
				});
			}
			if (!transition) {
				setTimeout(function () { $underline.removeClass('disable-trans') }, 0);//get into the queue.
			}
		}
		$headerMenu.on('mouseenter', 'li', function (e) {
			setUnderline($(e.currentTarget));
		});
		$headerMenu.on('mouseout', function () {
			setUnderline();
		});
		//set current active nav
		var $active_link = null;
		if (location.pathname === '/' || location.pathname.startsWith('/page/')) {
			$active_link = $('.nav-home', $headerMenu);
		} else {
			var name = location.pathname.match(/\/(.*?)\//);
			if (name && name.length > 1) {
				$active_link = $('.nav-' + name[1], $headerMenu);
			}
		}
		setUnderline($active_link, false);
	}
	function setHeaderMenuPhone() {
		var $switcher = $('.l_header .switcher .s-menu');
		$switcher.click(function (e) {
			e.stopPropagation();
			$('body').toggleClass('z_menu-open');
			$switcher.toggleClass('active');
			// slove mobile click disabled
			$('body').css('cursor', 'pointer')
		});
		$(document).click(function (e) {
			$('body').removeClass('z_menu-open');
			$switcher.removeClass('active');
			$('body').css('cursor', '')
		});
	}
	function setHeaderSearch() {
		var $switcher = $('.l_header .switcher .s-search');
		var $header = $('.l_header');
		var $search = $('.l_header .m_search');
		if ($switcher.length === 0) return;
		$switcher.click(function (e) {
			e.stopPropagation();
			$header.toggleClass('z_search-open');
			$search.find('input').focus();
			// slove mobile click disabled
			$('body').css('cursor', 'pointer')
		});
		$(document).click(function (e) {
			$header.removeClass('z_search-open');
			// slove mobile click disabled
			$('body').css('cursor', 'pointer')
		});
		$search.click(function (e) {
			e.stopPropagation();
		})
	}
	function setWaves() {
		Waves.attach('.flat-btn', ['waves-button']);
		Waves.attach('.float-btn', ['waves-button', 'waves-float']);
		Waves.attach('.float-btn-light', ['waves-button', 'waves-float', 'waves-light']);
		Waves.attach('.flat-box', ['waves-block']);
		Waves.attach('.float-box', ['waves-block', 'waves-float']);
		Waves.attach('.waves-image');
		Waves.init();
	}
	function setScrollReveal() {
		const $reveal = $('.reveal');
		if ($reveal.length === 0) return;
		const sr = ScrollReveal({ distance: 0 });
		sr.reveal('.reveal');
	}
	function changeToc() {
		const $toc = [$('.toc-wrapper'), $('.toc-wrapper-vdom')];
		for(let i = 0; i < $toc.length; i++) {
			setTocToggle($toc[i]);
		}
	}
	function setTocToggle(el) {
		// const $toc = $('.toc-wrapper');
		const $toc = el;
		if ($toc.length === 0) return;
		$toc.click((e) => { e.stopPropagation(); $toc.addClass('active'); });
		$(document).click(() => $toc.removeClass('active'));

		$toc.on('click', 'a', (e) => {
			e.preventDefault();
			e.stopPropagation();
			scrolltoElement(e.target.tagName.toLowerCase === 'a' ? e.target : e.target.parentElement);
		});

		const liElements = Array.from($toc.find('li a'));
		//function animate above will convert float to int.
		const getAnchor = () => liElements.map(elem => Math.floor($(elem.getAttribute('href')).offset().top - scrollCorrection));

		let anchor = getAnchor();
		const scrollListener = () => {
			const scrollTop = $('html').scrollTop() || $('body').scrollTop();
			if (!anchor) return;
			//binary search.
			let l = 0, r = anchor.length - 1, mid;
			while (l < r) {
				mid = (l + r + 1) >> 1;
				if (anchor[mid] === scrollTop) l = r = mid;
				else if (anchor[mid] < scrollTop) l = mid;
				else r = mid - 1;
			}
			$(liElements).removeClass('active').eq(l).addClass('active');
		}
		$(window)
			.resize(() => {
				anchor = getAnchor();
				scrollListener();
			})
			.scroll(() => {
				scrollListener()
			});
		scrollListener();
	}
	// function getPicture() {
	// 	const $banner = $('.banner');
	// 	if ($banner.length === 0) return;
	// 	const url = ROOT + 'js/lovewallpaper.json';
	// 	$.get(url).done(res => {
	// 		if (res.data.length > 0) {
	// 			const index = Math.floor(Math.random() * res.data.length);
	// 			$banner.css('background-image', 'url(' + res.data[index].big + ')');
	// 		}
	// 	})
	// }

	// function getHitokoto() {
	// 	const $hitokoto = $('#hitokoto');
	// 	if($hitokoto.length === 0) return;
	// 	const url = 'http://api.hitokoto.us/rand?length=80&encode=jsc&fun=handlerHitokoto';
	// 	$('body').append('<script	src="%s"></script>'.replace('%s',url));
	// 	window.handlerHitokoto = (data) => {
	// 		$hitokoto
	// 			.css('color','transparent')
	// 			.text(data.hitokoto)
	// 		if(data.source) $hitokoto.append('<cite> ——  %s</cite>'.replace('%s',data.source));
	// 		else if(data.author) $hitokoto.append('<cite> ——  %s</cite>'.replace('%s',data.author));
	// 		$hitokoto.css('color','white');
	// 	}
	// }


	$(function () {
		//set header
		setHeader();
		setHeaderMenu();
		setHeaderMenuPhone();
		setHeaderSearch();
		setWaves();
		setScrollReveal();
		// setTocToggle();
		changeToc();
		// getHitokoto();
		// getPicture();


		$(".article .video-container").fitVids();

		setTimeout(function () {
			$('#loading-bar-wrapper').fadeOut(500);
		}, 300);

		if (SEARCH_SERVICE === 'google') {
			customSearch = new GoogleCustomSearch({
				apiKey: GOOGLE_CUSTOM_SEARCH_API_KEY,
				engineId: GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
				imagePath: "/images/"
			});
		}
		else if (SEARCH_SERVICE === 'algolia') {
			customSearch = new AlgoliaSearch({
				apiKey: ALGOLIA_API_KEY,
				appId: ALGOLIA_APP_ID,
				indexName: ALGOLIA_INDEX_NAME,
				imagePath: "/images/"
			});
		}
		else if (SEARCH_SERVICE === 'hexo') {
			customSearch = new HexoSearch({
				imagePath: "/images/"
			});
		}
		else if (SEARCH_SERVICE === 'azure') {
			customSearch = new AzureSearch({
				serviceName: AZURE_SERVICE_NAME,
				indexName: AZURE_INDEX_NAME,
				queryKey: AZURE_QUERY_KEY,
				imagePath: "/images/"
			});
		}
		else if (SEARCH_SERVICE === 'baidu') {
			customSearch = new BaiduSearch({
				apiId: BAIDU_API_ID,
				imagePath: "/images/"
			});
		}

	});

})(jQuery);
