import React, { useReducer, useCallback } from 'react';
import Card from '@material-ui/core/Card'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Form from './Form';
import { IconButton } from '@material-ui/core';

export const ACTIONS = {
    ADD_SET: 'ADD_SET',
    REMOVE_SET: 'REMOVE_SET',
    ADD_PIZZA: 'ADD_PIZZA',
    REMOVE_PIZZA: 'REMOVE_PIZZA',
    UPDATE_PIZZA: 'UPDATE_PIZZA',
    SET_PROMO_CODE: 'SET_PROMO_CODE',
    UPDATE_OWNER: 'UPDATE_OWNER',
    DELETE_OWNER: 'DELETE_OWNER',
    BULK_DELETE_OWNERS: 'BULK_DELETE_OWNERS',
    CHANGE_OWNER_TYPE: 'CHANGE_OWNER_TYPE',
};


// const exampleOptionSetItem = {
//     items: []
// }

const PIZZA_SHAPES = [
    'CIRCLE',
    'SQUARE'
];

const makeDefaultPizza = (opts = {}) => ({
    type: PIZZA_SHAPES[0],
    size: 14,
    sizeUnit: 'cm',
    cost: 10,
    costCurrency: 'USD',
    ...opts
})
const makeDefaultOptionSet = (opts = {}) => ({
    pies: [
        makeDefaultPizza()
    ]
})


const getInitialState = () => {

    return {
        optionSets: [
            makeDefaultOptionSet()
        ],
    }
}



const comparisonReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.ADD_SET:
            return {
                ...state,
                optionSets: [
                    ...state.optionSets,
                    makeDefaultOptionSet()
                ]
            }
        case ACTIONS.REMOVE_SET:
            return {
                ...state,
                optionSets: state.optionSets.filter((set, idx) => idx !== action.setIdx)
            }
        case ACTIONS.ADD_PIZZA:
            return {
                ...state,
                optionSets: state.optionSets.map((set, idx) => idx !== action.setIdx ? set : {
                    ...set,
                    pies: [
                        ...set.pies,
                        makeDefaultPizza()
                    ]
                })
            }
        case ACTIONS.UPDATE_PIZZA:
            return {
                ...state,
                optionSets: state.optionSets.map((set, idx) => idx !== action.setIdx ? set : {
                    ...set,
                    pies: set.pies.map((pie, pieIdx) => pieIdx !== action.pieIdx ? pie : {
                        ...pie
                    })
                })
            }
        case ACTIONS.REMOVE_PIZZA:
            return {
                ...state,
                optionSets: state.optionSets.map((set, idx) => idx !== action.setIdx ? set : {
                    ...set,
                    pies: set.pies.filter((pie, pieIdx) => pieIdx !== action.payload)
                })
            }
        default:
            return state;
    }
}


const useComparison = (opts = {}) => {
    const [state, dispatch] = useReducer(comparisonReducer, getInitialState());

    // OPTIONS SETS
    const addOptionSet = () => {
        dispatch({
            type: ACTIONS.ADD_SET
        })
    }
    const removeOptionSet = (setIdx) => {
        dispatch({
            type: ACTIONS.REMOVE_SET,
            setIdx
        })
    }

    // PIZZAS
    const addPizza = (setIdx) => {
        dispatch({
            type: ACTIONS.ADD_PIZZA,
            setIdx
        })
    }
    const updatePizza = (setIdx, pieIdx, updatedPie) => {
        dispatch({
            type: ACTIONS.UPDATE_PIZZA,
            setIdx,
            pieIdx,
            payload: updatedPie
        })
    }
    const removePizza = (setIdx, pieIdx) => {
        dispatch({
            type: ACTIONS.REMOVE_PIZZA,
            setIdx,
            pieIdx
        })
    }

    let actions = {
        addOptionSet,
        removeOptionSet,
        addPizza,
        removePizza,
        updatePizza
    };
    return {
        state,
        actions,
        rawDispatch: dispatch
    }
}

const PieLine = ({ pie, index }) => {
    return <Box>
        Pie
    </Box>
}

const ComparisonSet = ({ actions, pies = [], index = 0 }) => {

    const addPieToSet = useCallback(
        () => {
            actions.addPizza(index)
        },
        [actions],
    );
    const removeSet = useCallback(
        () => {
            actions.removeOptionSet(index)
        },
        [actions],
    );
    return <Card style={{padding: '1rem'}}>
        <Box display="flex" justifyContent="space-between" alignItems="center" style={{borderBottom: '1px solid rgba(0,0,0,0.2)', marginBotom: 6}}>
            <Typography variant={'h6'}>Order Combo #{index + 1}</Typography>
            <IconButton onClick={removeSet}>
                <DeleteIcon />
            </IconButton>
        </Box>
        <Box display="flex" justifyContent="space-around">
            <Typography>
                {pies.length} Pies
            </Typography>
            <Typography>
                ${pies.reduce((acc, pie) => acc + pie.cost, 0)} Total
            </Typography>
        </Box>
        {
            pies.map((pie, i) => <PieLine key={i} pie={pie} />)
        }
        <Button variant="contained" color="Primary" onClick={addPieToSet}>
            <AddIcon /> Pie
        </Button>
    </Card>
}

const Comparison = () => {
    const { state, actions } = useComparison();

    const {
        optionSets
    } = state;
    return <Container>
        <Typography variant="h3" textAlign="center">Compare Pizzas</Typography>
        <Grid container>
            <Box display={'flex'}>
                {
                    optionSets.map((set, i) => <Box flex={1} key={i}>
                        <ComparisonSet index={i} actions={actions} {...set} />
                    </Box>)
                }
            </Box>
            <Grid item>
                <Button variant="h5" textAlign="center" onClick={actions.addOptionSet}>Add New Set</Button>
            </Grid>
        </Grid>
    </Container>
}

export default Comparison;