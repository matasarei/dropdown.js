/* 
 * @author    Yevhen Matasar <matasar.ei@gmail.com>
 * @copyright C-Format, 2015
 */

/**
 * @param string selector Dropdown menu selector
 * @param string controls Controls container selector
 * @param obj params Additional params
 * @returns {DropdownMenu} instance
 */
var DropdownMenu = function (selector, controls, params) {
    var ref = this;
    this.selector = selector;
    this.controls = controls;
    this.timeoutInstance = null;

    if (params.timeout) {
        this.timeout = params.timeout;
    } else {
        this.timeout = 1500;
    }

    if (params.debug) {
        this.debug = true;
    } else {
        this.debug = false;
    }

    if (params.animation !== undefined) {
        this.animation = params.animation;
    } else {
        this.animation = 250;
    }

    var hover = function (selector) {
        if ($(selector + ':hover').length > 0) {
            return true;
        }
        return false;
    };

    var timeOut = function (category) {
        clearTimeout(ref.timeoutInstance);
        ref.timeoutInstance = setTimeout(function () {
            if (hover(ref.selector + ' [data-category=' + category + ']') || hover(ref.controls)) {
                timeOut(category);
            } else {
                ref.close();
            }
        }, ref.timeout);
    };

    /**
     * Open dropdown menu with category
     * @param string category Category name
     * @returns {undefined}
     */
    this.open = function (category) {
        $(this.selector + ' [data-category]').each(function () {
            if ($(this).data('category') !== category) {
                $(this).hide();
            }
        });

        !this.debug && timeOut(category);
        var category = $(ref.selector + ' [data-category=' + category + ']');
        var menu = $(ref.selector);
        var height = category.height();

        if (category.css('display') === 'none') {
            category.fadeIn(this.animation);
        }
        if (menu.css('visibility') === 'hidden') {
            menu.css({
                visibility: 'visible',
                height: 0
            });
        }
        menu.animate({height: height}, this.animation);
    };

    /**
     * Close dropdown menu
     * @returns {undefined}
     */
    this.close = function () {
        var menu = $(ref.selector);
        menu.animate({
            height: 0,
            visibility: 'hidden'
        }, this.animation, function () {
            $(ref.selector + ' [data-category]').hide();
        });
    };

    //hide menu
    $(this.selector).css('visibility', 'hidden');

    //bind controls
    $(this.controls + ' [data-category]').each(function () {
        var category = $(this).data('category');
        $(this).mouseenter(function () {
            ref.open(category);
        });
    });
};
