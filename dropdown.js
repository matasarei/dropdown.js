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

    if (typeof params.onOpen === 'function') {
        this.onOpen = params.onOpen;
    } else {
        this.onOpen = function() {}
    }

    if (typeof params.onClose === 'function') {
        this.onClose = params.onClose;
    } else {
        this.onClose = function() {}
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
        if (this.opened == category) {
            return false;
        }

        //setup close timeout
        !this.debug && timeOut(category);
        var container = $(ref.selector + ' [data-category=' + category + ']');

        //the container does not exist
        if (!container.length) {
            return false;
        }

        //hide oppened containers
        $(this.selector + ' [data-category]').each(function () {
            if ($(this).data('category') !== category) {
                $(this).hide();
            }
        });

        //open menu
        var menu = $(ref.selector);

        //triger event
        this.onOpen({
            'dropdown': this,
            'category': category,
            'container': container,
            'controls': menu
        });

        //set styles and open
        var height = container.height();
        if (container.css('display') === 'none') {
            container.fadeIn(this.animation);
        }
        if (menu.css('visibility') === 'hidden') {
            menu.css({
                visibility: 'visible',
                height: 0
            });
        }
        menu.animate({height: height}, this.animation);
        this.opened = category;
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

        //triger event
        this.onClose({
            'dropdown': this,
            'controls': menu
        });

        this.opened = false;
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
