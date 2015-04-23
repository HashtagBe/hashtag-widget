var HashtagItem, HashtagList;

/**
 * A wrapper for a hashtag item.
 * @author Paolo D'Apice
 */
HashtagItem = (function() {

    /**
     * @constructor
     * @param {object} data - The hashtag object.
     */
    function HashtagItem(data) {
        this.data = data;
    }

    /**
     * The EJS template
     * @private
     */
    var template = new EJS({ url: 'js/item.ejs' });

    /**
     * Renders the item as HTML.
     * Need to explicitly call HashtagItem.drawRadial().
     * @return {string} - The rendered item.
     */
    HashtagItem.prototype.html = function() {
        return template.render({ obj: this.data });
    };
     * Renders the item.
     * @param {string} element - Optional. Element into which append the item.
     * @return {object} - The generated item.
     */
    HashtagItem.prototype.render = function(element) {
        var item = $(template.render({ obj: this.data }));
        if (element) {
            item.appendTo(element).drawRadial();
        }
        return item;
    };

    (function($) {
        $.fn.drawRadial = function() {
            // TODO early return if not an hashtag
            var width = 10;
            var size = 64;

            var canvas = $(this).find('canvas.hashtag-level-bar');
            var level = canvas.data('level');

            setTimeout(render, 500, canvas, level, width, size);
        };
    })(jQuery);

    function render(canvas, originalValue, width, originalSize, value) {
        if (value == undefined) {
            value = 0.1;
        }

        var gapStart = 0.5,
            gapEnd = 0.5;

        if (value > 0.5) {
            gapEnd = -(value * 0.5);
        } else if (value <= 0) {
            gapStart = 0;
            gapEnd = 0;
        } else {
            gapEnd = 0.25 - (value * 0.5);
        }

        var ctx = canvas[0].getContext('2d');
        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

        var start = Math.PI / 2;
        var end = value * (Math.PI * 2) + Math.PI / 2;

        ctx.translate(width / 2 + 4, width / 2 + 4);
        var size = originalSize + 2;

        var yellowPart = ctx.createLinearGradient(0, 0, 0, size * 2);
        yellowPart.addColorStop(0, 'orange');
        yellowPart.addColorStop(1, 'yellow');

        var redPart = ctx.createLinearGradient(0, 0, 0, size * 2);
        redPart.addColorStop(0, 'orange');
        redPart.addColorStop(1, 'red');

        ctx.lineWidth = width;
        ctx.lineCap = 'round';

        ctx.shadowColor = '#999';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = -2;
        ctx.shadowOffsetY = 2;
        ctx.save();

        ctx.beginPath();
        ctx.rect(-width, -width, size + width, size * 2 + width * 2);
        ctx.clip();
        ctx.strokeStyle = yellowPart;
        ctx.beginPath();
        ctx.arc(size, size, size, start + gapStart, end + gapEnd, false);
        ctx.stroke();
        ctx.restore();
        ctx.save();

        ctx.beginPath();
        ctx.rect(size, -width, size + width, (size * 2) + width * 2);
        ctx.clip();
        ctx.strokeStyle = redPart;
        ctx.beginPath();
        ctx.arc(size, size, size, start + gapStart, end + gapEnd, false);
        ctx.stroke();
        ctx.restore();

        ctx.translate(-width / 2 - 4, -width / 2 - 4);

        if (originalValue > value) {
            setTimeout(render, 30, canvas, originalValue, width, originalSize, value + 0.06);
        }
    }

    return HashtagItem;
})();

/**
 * A wrapper for a list of hashtags.
 * @author Paolo D'Apice
 */
HashtagList = (function() {

    /**
     * @constructor
     * @param {array} data - The array of hashtag objects.
     */
    function HashtagList(data) {
        this.data = data;
    }

    /**
     * The EJS template
     * @private
     */
    var template = new EJS({ url: 'js/list.ejs' });

    /**
     * Renders the list as HTML.
     * Need to explicitly call HashtagItem.drawRadial().
     * @return {string} - The rendered list.
     */
    HashtagList.prototype.html = function() {
        return template.render({ data: this.data });
    };

    /**
     * Renders the list.
     * @param {string} element - Element into which append the list.
     * @return {object} - The generated list.
     */
    HashtagList.prototype.render = function(element) {
        return $(this.html())
        .appendTo(element)
        .find('.hashtag').each(function() {
            HashtagItem.drawRadial(this)
        });
    };

    return HashtagList;
})();

/**
 * jQuery.hashtag plugin.
 * @author Paolo D'Apice.
 */
(function($) {

    /**
     * Generates a hashtag item.
     */
    $.fn.hashtagItem = function(data) {
        return new HashtagItem(data).render(this);
    }

    /**
     * Generates a hashtag list.
     */
    $.fn.hashtagList = function(data) {
        return new HashtagList(data).render(this);
    };

})(jQuery);
