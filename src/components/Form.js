/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useForm, Controller, FormContext } from 'react-hook-form';
import { Box, Button, withStyles, Input as MUIInput, Select as MUISelect, MenuItem, TextField, IconButton, Typography } from '@material-ui/core';
import { Debug } from './admin';
import { formatAsDollar } from '../utils/finance';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import FormLabel from '@material-ui/core/FormLabel';

const SubmitButton = withStyles((theme) => ({
    root: {
        fontSize: 16,
        fontWeight: 'bolder',
        minWidth: 90,
        textTransform: 'none',
        width: '80%',
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        borderRadius: 90,
    },
    label: {
    },
}))(Button);


const MINUTES_UNIT = 15;
const MINIMUM_UNITS = 1; // 15 minutes minumum
const MINIMUM_MINUTES = MINUTES_UNIT * MINIMUM_UNITS;
const DEFAULT_MINUTES = 120;

const CostEstimateTypography = withStyles({
    root: {
        fontSize: 24,
    },
})(Typography);

const ListingDurationInput = ({ setValue, inputProps: { dailyMaxRate = 0, hourlyRate = 0 }, label, register, name }) => {
    const [duration, setDuration] = useState(DEFAULT_MINUTES);
    const handleIncrementDuration = () => setDuration(duration + MINUTES_UNIT);
    const handleDecrementDuration = () => setDuration(Math.max(duration - MINUTES_UNIT, MINIMUM_MINUTES));
    useEffect(() => {
        setValue(name, duration, true);
        return () => {
            // Do nothing to cleanup
        };
    }, [duration]);
    useEffect(() => {
        register({ name }); // custom register react-select
    }, [register]);
    const quarterlyRate = hourlyRate / 4;
    const preCappedRate = (duration / MINUTES_UNIT) * quarterlyRate;
    const currentRate = dailyMaxRate ? Math.min(preCappedRate, dailyMaxRate) : preCappedRate;
    return (
        <React.Fragment>
            <FormLabel><Typography variant="subtitle1">{label}</Typography></FormLabel>
            <Box display="flex" alignItems="center">
                <Box flex={1}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="h2">
                            {(duration)}
                        </Typography>
                        <Box component="span" marginLeft={2}>
                            <CostEstimateTypography variant="subtitle1" fontSize={34}>
                                {currentRate && formatAsDollar(currentRate)}
                            </CostEstimateTypography>
                        </Box>
                    </Box>
                </Box>
                <IconButton variant="" disabled={duration <= MINIMUM_MINUTES} onClick={handleDecrementDuration}>
                    <MinusIcon />
                </IconButton>
                <IconButton variant="" onClick={handleIncrementDuration}>
                    <AddIcon />
                </IconButton>
            </Box>
        </React.Fragment>
    );
};


export function Input({ register, name, ...rest }) {
    return <MUIInput name={name} inputRef={register} {...rest} />;
}

export function Select({ register, options, name, ...rest }) {
    return (
        <select name={name} ref={register} {...rest}>
            {options.map(value => (
                <option value={value}>{value}</option>
            ))}
        </select>
    );
}

export function Form({
    defaultValues = {},
    schemaValidation,
    renderSubmitText = () => 'Pay',
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
