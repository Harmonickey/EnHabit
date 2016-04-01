ko.bindingHandlers.stopBinding = {
    init: function () {
        return { controlsDescendantBindings: true };
    }
};

ko.virtualElements.allowedBindings.stopBinding = true;

ko.bindingHandlers.bootstrapSwitchOn = {
    init: function (element, valueAccessor, bindingsAccessor, viewModel)
    {
        var $elem = $(element),
            bindings = bindingsAccessor(),
            settings = bindings.settings,
            value = valueAccessor();

        settings.setState = ko.utils.unwrapObservable(valueAccessor());

        $elem.bootstrapSwitch(settings);

        // Update the value when changed
        $elem.on('switchChange.bootstrapSwitch', function (e, data)
        {
            value(data);
        });
    },
    update: function (element, valueAccessor, bindingsAccessor, viewModel)
    {
        var $elem = $(element);
        var vStatus = $elem.bootstrapSwitch('state');
        var vmStatus = ko.utils.unwrapObservable(valueAccessor());
        if (vStatus != vmStatus)
        {
            $elem.bootstrapSwitch('setState', vmStatus);
        }
    }
};

ko.bindingHandlers.autoNumeric = {
    init: function (element, valueAccessor, bindingsAccessor, viewModel)
    {
        var $elem = $(element),
            bindings = bindingsAccessor(),
            settings = bindings.settings,
            value = valueAccessor();

        $elem.autoNumeric(settings);
        $elem.autoNumeric('set', parseFloat(ko.utils.unwrapObservable(value()), 10));

        // update the value when changed
        $elem.change(function ()
        {
            value(parseFloat($elem.autoNumeric('get'), 10));
        });
    },
    update: function (element, valueAccessor, bindingsAccessor, viewModel)
    {
        var $elem = $(element),
            newValue = parseFloat(ko.utils.unwrapObservable(valueAccessor()), 10),
            elementValue = parseFloat($elem.autoNumeric('get'), 10),
            valueHasChanged = (newValue != elementValue);

        if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0"))
        {
            valueHasChanged = true;
        }

        if (valueHasChanged)
        {
            $elem.autoNumeric('set', newValue);
            setTimeout(function () { $elem.change() }, 0);
        }
    }
};

ko.bindingHandlers.addressAutocomplete = {
    init: function (element, valueAccessor, bindingsAccessor)
    {
        var value = valueAccessor(),
            bindings = bindingsAccessor(),
            location = bindings.location;

        var options = { types: ['geocode'] };
        ko.utils.extend(options, bindings.autocompleteOptions)

        var autocomplete = new google.maps.places.Autocomplete(element, options);

        google.maps.event.addListener(autocomplete, 'place_changed', function ()
        {
            result = autocomplete.getPlace();

            // set the binding's Address field
            if (result.formatted_address)
            {
                value(result.formatted_address);
            }

            // set the extra x and y coordinate fields
            if (result.geometry)
            {
                var keys = Object.keys(result.geometry.location);
                location.X(result.geometry.location[keys[0]]);
                location.Y(result.geometry.location[keys[1]]);
            }
        });


    },
    update: function (element, valueAccessor, bindingsAccessor)
    {
        ko.bindingHandlers.value.update(element, valueAccessor);
    }
};