import React from 'react'
import { useHistory, useRouteMatch, RouteProps } from 'react-router'
import {
    Dialog,
    Grow,
    makeStyles,
    createStyles,
    Divider,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'
import CloseIcon from '@material-ui/icons/Close'

import classNames from 'classnames'
import { Route } from 'react-router-dom'

const useStyles = makeStyles(theme =>
    createStyles({
        dialog: {
            backgroundColor: theme.palette.type === 'light' ? '#F7F8FA' : '#343434',
            width: '100%',
            justifyContent: 'center',
        },
        dialogTitle: {
            padding: theme.spacing(1, 4, 1, 1),
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            wordBreak: 'break-all',
            overflow: 'hidden',
        },
        dialogTitleSimplified: {
            padding: theme.spacing(2, 4, 0),
        },
        dialogContent: {
            padding: theme.spacing(2, 4),
            lineHeight: 2,
        },
        dialogActions: {
            padding: theme.spacing(0, 4, 2),
            '& .actionButton': {
                width: 140,
            },
        },
        dialogActionsCenter: {
            justifyContent: 'center',
        },
        closeButton: {
            marginRight: theme.spacing(2),
        },
    }),
)

// const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
//     return <Grow style={{ transformOrigin: '0 0 0' }} ref={ref} {...props} />
// })

interface DialogContentItemProps {
    title: JSX.Element | string
    content: JSX.Element | string
    actions?: JSX.Element | null
    actionsAlign?: 'center'
    simplified?: boolean
    onExit?: string | (() => void)
}

export function DialogContentItem(props: DialogContentItemProps) {
    const { title, content, actions, onExit, actionsAlign, simplified } = props
    const classes = useStyles()
    const history = useHistory()

    const onExitAction =
        typeof onExit === 'function'
            ? onExit
            : () => {
                  history.push(onExit || '../')
              }

    return (
        <>
            <DialogTitle className={classNames(classes.dialogTitle, { [classes.dialogTitleSimplified]: simplified })}>
                {!simplified && (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onExitAction}>
                        <CloseIcon />
                    </IconButton>
                )}
                {title}
            </DialogTitle>
            {!simplified && <Divider />}
            <DialogContent className={classes.dialogContent}>{content}</DialogContent>
            <DialogActions
                className={classNames(classes.dialogActions, {
                    [classes.dialogActionsCenter]: actionsAlign === 'center',
                })}>
                {actions}
            </DialogActions>
        </>
    )
}

interface DialogRouterProps {
    path?: string | RouteProps
    component?: React.ComponentType<any>
    children?: JSX.Element
    fullscreen?: boolean
    onExit?: string | (() => void)
}

export function DialogRouter(props: DialogRouterProps) {
    const { component: Component, children, path, fullscreen, onExit } = props
    const history = useHistory()
    const prevMatch = useRouteMatch()
    const matchPattern = useRouteMatch((prevMatch?.path ?? '/').replace(/\/$/, '') + path)
    const routeMatching = !path ? true : !!matchPattern
    const classes = useStyles()

    const onExitAction =
        typeof onExit === 'function'
            ? onExit
            : () => {
                  history.push(onExit || '..')
              }

    return (
        <Dialog
            disableEscapeKeyDown
            closeAfterTransition
            onClose={onExitAction}
            fullScreen={fullscreen || false}
            open={routeMatching}
            classes={{ paper: classes.dialog }}>
            <Route path={matchPattern?.path}>
                {Component && <Component></Component>}
                {children || null}
            </Route>
        </Dialog>
    )
}