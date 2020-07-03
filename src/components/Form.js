/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    withStyles,
    TextField,
    MenuItem,
    IconButton,
    Typography
} from '@material-ui/core';
import { Debug } from './admin';
import { formatAsDollar } from '../utils/finance';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import MinusIcon from '@material-ui/icons/Remove';
import FormLabel from '@material-ui/core/FormLabel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const SubmitButton = withStyles((theme) => ({
    root: {
        fontSize: 16,
        fontWeight: 'bolder',
        textTransform: 'none',
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        borderRadius: 90,
    },
    label: {
    },
}))(Button);


export function Input({ register, name, ...rest }) {
    return <TextField name={name} inputRef={register} {...rest} />;
}

export function Select({ register, options, label, name, ...rest }) {
    return (
        <React.Fragment>
            <FormLabel>
                {label}
            </FormLabel>
            <select name={name} ref={register} {...rest}>
                {options.map(value => (
                    <option value={value}>{value}</option>
                ))}
            </select>
        </React.Fragment>
    );
}

export function ToggleGroup({ register, required, setValue = () => (false), onChange, defaultValue, options, label, name, ...rest }) {
    const [internalValue, setInternalValue] = useState(defaultValue);

    const handleNewValue = (event, newValue) => {
        setInternalValue(newValue);
    };
    useEffect(() => {
        console.log(name, internalValue);
        if (setValue) {
            setValue(name, internalValue);
        }
        if (onChange) {
            onChange(internalValue);
        }
        return () => {
            // Do nothing to cleanup
        };
    }, [internalValue]);
    useEffect(() => {

        if (!register) return;

        register({ name, required }); // custom register react-select
    }, [register]);

    return <ToggleButtonGroup label={label} value={internalValue} exclusive onChange={handleNewValue} aria-label={label} {...rest}>
        {
            options.map((opt) => <ToggleButton value={opt.value} aria-label={opt.label}>
                {
                    opt.icon
                }
            </ToggleButton>)
        }
    </ToggleButtonGroup>
}

export function Form({
    defaultValues = {},
    schemaValidation,
    renderSubmitText = () => <SaveIcon />,
    hideSubmit,
    submitContainerProps = {},
    children,
    debug,
    isLoading,
    onSubmit,
}) {
    const methods = useForm({
        mode: 'onBlur',
        defaultValues,
        schemaValidation,
    });
    const { handleSubmit } = methods;

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            {Array.isArray(children)
                ? children.map(child => (child.props && child.props.name
                    ? React.createElement(child.type, {
                        ...{
                            ...child.props,
                            ...methods,
                            key: child.props ? child.props.name : child.key,
                        },
                    })
                    : child))
                : children}
            <Box textAlign="center" {...submitContainerProps}>
                {
                    hideSubmit ? null
                        : (
                            <SubmitButton variant="contained" color="primary" type="submit">
                                {isLoading ? 'Loading...' : renderSubmitText({ formState: methods.getValues(), getValues: methods.getValues })}
                            </SubmitButton>
                        )
                }
            </Box>
            {
                debug
                    ? <Debug display data={methods.formState} />
                    : null
            }
        </form>
    );
}
Form.Input = Input;

export default Form;
