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
    var dropdown = this;
    this.selector = selector;
    this.controls = controls;
    this.timeoutInstance = null;
    this.timeoutStart = null;



    if (params.timeout) {
        this.timeout = params.timeout;
    } else {
        this.timeout = 1500;
    }

    //debug mode
    if (params.debug) {
        this.debug = true;
    } else {
        this.debug = false;
    }

    //amination speed
    if (params.animation !== undefined) {
        this.animation = params.animation;
    } else {
        this.animation = 250;
    }

    //start menu speed
    if (params.startTime) {
        this.startTime = params.startTime;
    } else {
        this.startTime = 0;
    }

    //open event
    if (typeof params.onOpen === 'function') {
        this.onOpen = params.onOpen;
    } else {
        this.onOpen = function () {
        }
    }

    //close event
    if (typeof params.onClose === 'function') {
        this.onClose = params.onClose;
    } else {
        this.onClose = function () {
        }
    }

    //hover check
    var hover = function (selector) {
        if ($(selector + ':hover').length > 0) {
            return true;
        }
        return false;
    };

    //close timeout
    var timeOut = function (category) {
        clearTimeout(dropdown.timeoutInstance);
        dropdown.timeoutInstance = setTimeout(function () {
            if (hover(dropdown.selector + ' [data-category=' + category + ']') || hover(dropdown.controls + " a[data-category=" + dropdown.opened + "]")) {
                timeOut(category);
            } else {
                dropdown.close();
            }
        }, dropdown.timeout);
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
        var container = $(dropdown.selector + ' [data-category=' + category + ']');

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
        var menu = $(dropdown.selector);

        //triger event
        this.onOpen({
            'dropdown': this,
            'category': category,
            'container': container,
            'controls': menu,
            'control': this.lastControl
        });

        //set styles and open
        var height = container.outerHeight();
        if (container.css('display') === 'none') {
            container.fadeIn(this.animation);
        }
        if (menu.css('visibility') === 'hidden') {
            menu.css({
                visibility: 'visible',
                height: 0
            });
        }
        menu.animate({height: height}, this.animation, function () {
            menu.removeClass('closed');
            menu.addClass('opened');
        });

        this.opened = category;
    };

    /**
     * Close dropdown menu
     * @returns {undefined}
     */
    this.close = function () {
        dropdown.opened = false;

        var menu = $(dropdown.selector);
        menu.animate({height: 0}, this.animation, function () {
            !dropdown.opened && menu.css('visibility', 'hidden');
            menu.removeClass('opened');
            menu.addClass('closed');
        });

        //triger event
        this.onClose({
            'dropdown': this,
            'controls': menu,
            'control': this.lastControl
        });
    };

    this.lastControl = null;

    //hide menu
    $(this.selector).css('visibility', 'hidden');

    //bind controls
    $(this.controls + ' [data-category]').each(function () {
        var category = $(this).data('category');
        $(this).mouseenter(function () {
            dropdown.lastControl = this;
            if (dropdown.startTime && !dropdown.opened) {
                clearTimeout(dropdown.timeoutInstance);
                dropdown.timeoutStart = setTimeout(function () {
                    if ($('[data-category]:hover').length > 0) {
                        dropdown.open(category);
                    }
                }, dropdown.startTime);
            } else {
                dropdown.open(category);
            }
        });
    });
};
