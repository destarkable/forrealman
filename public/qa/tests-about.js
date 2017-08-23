suite('About Page Tests', function () {
	test('page should contain a link to contact page',function () {
		assert($('a[href="/contact"]').length);
	});
});
//确保about页面具有指向contact页面的链接