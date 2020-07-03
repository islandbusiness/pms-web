import React, { useReducer, useCallback } from 'react';
import Card from '@material-ui/core/Card'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Form, ToggleGroup, Input } from './Form';
import { IconButton } from '@material-ui/core';
import LocalPizzaIcon from '@material-ui/icons/LocalPizza';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
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
    quantity: 1,
    ...opts
})
const makeDefaultOptionSet = (opts = {}) => ({
    pies: opts.pies || [
        makeDefaultPizza()
    ]
})


const getInitialState = () => {

    return {
        optionSets: [
            makeDefaultOptionSet(),
            makeDefaultOptionSet({
                pies: [
                    makeDefaultPizza({ size: 20, cost: 20 })
                ]
            }),
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
                        ...action.payload,
                        size: +action.payload.size,
                        cost: +action.payload.cost
                    })
                })
            }
        case ACTIONS.REMOVE_PIZZA:
            return {
                ...state,
                optionSets: state.optionSets.map((set, idx) => idx !== action.setIdx ? set : {
                    ...set,
                    pies: set.pies.filter((pie, pieIdx) => pieIdx !== action.pieIdx)
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
};

const PIE_OPTS = [
    {
        value: "CIRCLE",
        label: 'circle',
        icon: <RadioButtonUncheckedIcon />
    },
    {
        value: "SQUARE",
        label: 'square',
        icon: <CropLandscapeIcon />
    }
]

const PieLine = ({ pie, setIdx, pieIdx }) => {
    const { actions } = React.useContext(PizzaContext)
    const removePie = useCallback(
        () => {
            actions.removePizza(setIdx, pieIdx)
        },
        [actions],
    );
    const updatePie = useCallback(
        (args) => {
            alert(JSON.stringify(args))
            actions.updatePizza(setIdx, pieIdx, args)
        },
        [actions],
    );
    return <Card style={{ padding: '1rem', marginBottom: 8 }}>
        <Box display="flex" alignItems='flex-start'>
            <Form onSubmit={updatePie} defaultValues={pie}>
                <ToggleGroup name="type" defaultValue={pie.type} options={PIE_OPTS} />
                <br />
                <Input name="size" label="Size" placeholder="Size (Inches)" />
                <Input name="cost" label="Cost" placeholder="Cost of Pizza ($)" />
            </Form>
            <IconButton onClick={removePie}>
                <DeleteIcon />
            </IconButton>
        </Box>
    </Card>
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
    return <Box style={{ padding: '1rem 0px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ borderBottom: '1px solid rgba(0,0,0,0.2)', marginBotom: 6 }}>
            <Typography variant={'h6'}>Order Combo #{index + 1}</Typography>
            <IconButton onClick={removeSet}>
                <DeleteIcon />
            </IconButton>
        </Box>
        <Box display="flex">
            {pies.map((p, idx) => <LocalPizzaIcon key={idx} />)}
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
            pies.map((pie, i) => <PieLine setIdx={index} pieIdx={i} actions={actions} key={i} pie={pie} />)
        }
        <Button variant="contained" color="Primary" onClick={addPieToSet}>
            <AddIcon /> Pie
        </Button>
    </Box>
}

const PizzaContext = React.createContext();

const Comparison = () => {
    const { state, actions } = useComparison();

    const {
        optionSets
    } = state;
    return <PizzaContext.Provider value={{ state, actions }}>
        <Container>
            <Grid container>
                <Box marginTop={2} marginBottom={2}>
                    <Typography variant="h4" fontWeight="bold" textAlign="center">Compare Pizza Orders</Typography>
                    <Typography variant="h6" textAlign="center">Find the best one!</Typography>
                </Box>
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
    </PizzaContext.Provider>
}

export default Comparison;