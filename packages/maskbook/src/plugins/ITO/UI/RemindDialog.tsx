import { Typography, Link, Checkbox, makeStyles, createStyles, FormControlLabel } from '@material-ui/core'
import { useI18N } from '../../../utils/i18n-next-ui'
import { useStylesExtends } from '../../../components/custom-ui-helper'
import type { ERC20TokenDetailed, EtherTokenDetailed } from '../../../web3/types'
import classNames from 'classnames'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { TokenIcon } from '../../../extension/options-page/DashboardComponents/TokenIcon'
import { formatEthereumAddress } from '../../Wallet/formatter'
import { resolveLinkOnEtherscan } from '../../../web3/pipes'
import type { ChainId } from '../../../web3/types'
import { ClaimStatus } from './ClaimGuide'
import { useState } from 'react'

const useStyles = makeStyles((theme) =>
    createStyles({
        reminderText: {
            color: '#FF5555',
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1.5),
        },
        reminderTextLast: {
            marginBottom: 0,
        },
        tokenWrapper: {
            display: 'flex',
            alignItems: 'center',
            marginTop: theme.spacing(2),
            padding: '1rem 2rem',
            background: theme.palette.mode === 'dark' ? '#17191D' : '#F7F9FA',
            borderRadius: 15,
        },
        tokenIcon: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 39,
            height: 39,
        },
        tokenTextWrapper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 45,
            marginLeft: '1rem',
        },
        tokenSymbol: {
            color: theme.palette.mode === 'dark' ? '#fff' : '#15181B',
            fontSize: 18,
            cursor: 'default',
        },
        tokenLink: {
            color: '#6F767C',
            fontSize: 15,
            '&:hover': {
                textDecoration: 'none',
            },
        },
        comfirmWrapper: {
            marginTop: theme.spacing(1),
            display: 'flex',
            alignItems: 'center',
        },
        comfirmText: {
            color: '#6F767C',
        },
        button: {
            width: 'fit-content',
            margin: '0 auto',
            padding: '6px 48px',
        },
    }),
)

export interface RemindDialogProps extends withClasses<'root'> {
    token: EtherTokenDetailed | ERC20TokenDetailed
    chainId: ChainId
    setStatus: React.Dispatch<React.SetStateAction<ClaimStatus>>
}

export function RemindDialog(props: RemindDialogProps) {
    const { t } = useI18N()
    const classes = useStylesExtends(useStyles(), {})
    const { token, chainId, setStatus } = props

    const [agreeReminder, setAgreeReminder] = useState(false)

    return (
        <>
            <Typography variant="body1" className={classes.reminderText}>
                {t('plugin_ito_dialog_claim_reminder_text1')}
            </Typography>
            <Typography variant="body1" className={classes.reminderText}>
                {t('plugin_ito_dialog_claim_reminder_text2')}
            </Typography>
            <Typography variant="body1" className={classes.reminderText}>
                {t('plugin_ito_dialog_claim_reminder_text3')}
            </Typography>
            <Typography variant="body1" className={classNames(classes.reminderText, classes.reminderTextLast)}>
                {t('plugin_ito_dialog_claim_reminder_text4')}
            </Typography>
            <section className={classes.tokenWrapper}>
                <TokenIcon address={token.address} classes={{ icon: classes.tokenIcon }} />
                <div className={classes.tokenTextWrapper}>
                    <Typography variant="h5" className={classes.tokenSymbol}>
                        {token.name}
                    </Typography>

                    <Link
                        target="_blank"
                        className={classes.tokenLink}
                        rel="noopener noreferrer"
                        href={`${resolveLinkOnEtherscan(chainId)}/token/${token.address}`}>
                        <Typography variant="body2">
                            {formatEthereumAddress(token.address, 4)}(View on Etherscan)
                        </Typography>
                    </Link>
                </div>
            </section>
            <section className={classes.comfirmWrapper}>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={agreeReminder}
                            onChange={(event) => {
                                setAgreeReminder(event.target.checked)
                            }}
                        />
                    }
                    label={t('plugin_ito_dialog_claim_reminder_agree')}
                />
            </section>
            <ActionButton
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => setStatus(ClaimStatus.Swap)}
                disabled={!agreeReminder}>
                Continue
            </ActionButton>
        </>
    )
}
