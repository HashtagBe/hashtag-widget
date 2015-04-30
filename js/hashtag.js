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
        this.label = 'truncate';
    }

    /**
     * Set options.
     * @param {object} options - The options object.
     *   Currently the following options are supported:
     *   - {boolean|string} label Whether to show name and energy amount.
     *                            If set to 'truncate' truncates long strings.
     */
    HashtagItem.prototype.options = function(options) {
        if (options) {
            if (options.label !== undefined)
                this.label = options.label;
        }
        return this;
    };

    /**
     * The JavaScript template.
     * @private
     */
    // jshint multistr: true
    var template = _.template('\
<div class="hashtag-item" data-id="<%= data.item.id %>" data-related-ids="<%= data.item.related_ids %>">\
  <div class="hashtag-circle">\
    <canvas class="hashtag-level-bar" data-level="<%= data.item.level / 10 %>"/>\
    <div class="hashtag-icon" style="background-image: url(<%= data.item.icon %>)">\
      <div class="hashtag-level">\
        <span><%= data.item.level %></span>\
      </div>\
    </div>\
  </div>\
  <% if (data.options.label) { %>\
    <div class="hashtag-label <%= data.options.label == "truncate" && "truncate" || "" %>">\
      <div>#<%= data.item.name %></div>\
      <div><%= data.item.energy %></div>\
    </div>\
  <% } %>\
</div>', { variable: 'data' });

    /**
     * Renders the item as HTML.
     * Need to explicitly call HashtagItem.drawRadial().
     * @return {string} - The rendered item.
     */
    HashtagItem.prototype.html = function() {
        return template({
            item: this.data,
            options: {
                label: this.label,
            }
        });
    };

    /**
     * Draw the energy bar on an item.
     * @param {string} element - The item.
     */
    HashtagItem.drawRadial = function(element) {
        var canvas = $(element).find('canvas.hashtag-level-bar');
        var level = canvas.data('level');
        var width = 10;
        var size = 64;

        if (level)
            setTimeout(draw, 500, canvas, level, width, size);
    };

    /**
     * Renders the item.
     * @param {string} element - Element into which append the item.
     * @return {object} - The generated item.
     */
    HashtagItem.prototype.render = function(element) {
        var item = $(this.html()).appendTo(element);
        HashtagItem.drawRadial(item);
        return item;
    };

    /**
     * Draw the radial energy bar into the canvas.
     * @private
     */
    var draw = function(canvas, originalValue, width, originalSize, value) {
        if (value === undefined) {
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
            setTimeout(draw, 30, canvas, originalValue, width, originalSize, value + 0.06);
        }
    };

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
     * Set options.
     * @param {object} options - The options object
     * @see HashtagItem#options
     */
    HashtagList.prototype.options = function(options) {
        this.options = options;
        return this;
    };

    /**
     * The JavaScript template.
     * @private
     */
    // jshint multistr: true
    var template = _.template('\
<ul class="hashtag-list">\
  <% data.list.forEach(function(item) { %>\
    <li><%= new HashtagItem(item).options(data.options).html() %></li>\
  <% }); %>\
</ul>', { variable: 'data' });

    /**
     * Renders the list as HTML.
     * Need to explicitly call HashtagItem.drawRadial().
     * @return {string} - The rendered list.
     */
    HashtagList.prototype.html = function() {
        return template({ list: this.data, options: this.options });
    };

    /**
     * Renders the list.
     * @param {string} element - Element into which append the list.
     * @return {object} - The generated list.
     */
    HashtagList.prototype.render = function(element) {
        return $(this.html())
          .appendTo(element)
          .find('.hashtag-item').each(function() {
              HashtagItem.drawRadial(this);
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
    $.fn.hashtagItem = function(data, options) {
        return new HashtagItem(data)
        .options(options)
        .render(this);
    };

    /**
     * Draw the radial energy bar.
     */
    $.fn.drawRadial = function() {
        HashtagItem.drawRadial(this);
        return this;
    };

    /**
     * Generates a hashtag list.
     */
    $.fn.hashtagList = function(data, options) {
        return new HashtagList(data)
        .options(options)
        .render(this);
    };

})(jQuery);
