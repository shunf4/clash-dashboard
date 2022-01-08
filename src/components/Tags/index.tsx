import classnames from 'classnames'
import { useState, useRef, useLayoutEffect } from 'react'

import { noop } from '@lib/helper'
import { Proxy } from '@lib/request'
import { BaseComponentProps } from '@models'
import { useI18n } from '@stores'
import './style.scss'

interface TagsProps extends BaseComponentProps {
    data: string[]
    onClick: (name: string) => void
    errSet?: Set<string>
    select: string
    rowHeight: number
    canClick: boolean
    onSpeedTest: (name: string) => void
    proxyMap: Map<string, Proxy>
}

export function Tags (props: TagsProps) {
    const { className, data, onClick, select, canClick, errSet, rowHeight: rawHeight, onSpeedTest, proxyMap } = props

    const { translation } = useI18n()
    const { t } = translation('Proxies')
    const [expand, setExpand] = useState(false)
    const [showExtend, setShowExtend] = useState(false)

    const tagRefs: Array<React.RefObject<HTMLLIElement>> = []

    const selectionCallback = (e: Event) => {
        setTimeout(() => {
            const selection = document.getSelection()
            if (selection === null || selection.isCollapsed ||
                selection.anchorNode === null || selection.focusNode === null || ulRef.current === null ||
                !ulRef.current.contains(selection.anchorNode) || !ulRef.current.contains(selection.focusNode)) {
                return
            }
            let startIndex = -1
            let endIndex = -1
            tagRefs.forEach((tagRef, i) => {
                if (tagRef.current?.contains(selection.anchorNode)) {
                    startIndex = i
                    if (selection.anchorOffset === selection.anchorNode?.textContent?.length) {
                        startIndex++
                    }
                }
                if (tagRef.current?.contains(selection.focusNode)) {
                    endIndex = i
                    if (selection.focusOffset === 0) {
                        endIndex--
                    }
                }
            })
            if (startIndex !== -1 && endIndex !== -1) {
                data.slice(startIndex, endIndex + 1).forEach(onSpeedTest)
                document.getSelection()?.removeAllRanges()
            }
        }, 50)
    }

    const ulRef = useRef<HTMLUListElement>(null)
    useLayoutEffect(() => {
        setShowExtend((ulRef?.current?.offsetHeight ?? 0) > 30)
        document.addEventListener('mouseup', selectionCallback)

        return () => {
            document.removeEventListener('mouseup', selectionCallback)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const rowHeight = expand ? 'auto' : rawHeight
    const handleClick = canClick ? onClick : noop

    function handleMiddleButtonDown (tag: string, e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        if (e.button === 1) { // Middle button
            e.preventDefault()
            onSpeedTest(tag)
        }
    }

    function toggleExtend () {
        setExpand(!expand)
    }

    const tags = data
        .map(t => {
            const history = proxyMap.get(t)?.history
            const hasSpeedTestResult = history && history.length !== 0 && history.slice(-1)[0].delay > 0.001
            const tagClass = classnames({ 'tags-selected': select === t, 'cursor-pointer': canClick, error: errSet?.has(t), 'has-speed-test-result': hasSpeedTestResult })
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const tagRef = useRef<HTMLLIElement>(null)
            tagRefs.push(tagRef)

            let delayDesc = ''
            if (hasSpeedTestResult) {
                delayDesc = '<' + (Math.round((history.slice(-1)[0].delay + Number.EPSILON) * 100) / 100).toString() + 'ms>'
            }

            return (
                <li className={tagClass} key={t} ref={tagRef} onClick={() => handleClick(t)} onMouseDown={(e) => handleMiddleButtonDown(t, e)}>
                    { t }{ delayDesc === '' ? '' : <br /> }{ delayDesc }
                </li>
            )
        })

    return (
        <div className={classnames('flex items-start overflow-y-hidden', className)} style={{ height: rowHeight }}>
            <ul ref={ulRef} className={classnames('tags', { expand })}>
                { tags }
            </ul>
            {
                showExtend &&
                <span className="h-7 px-5 select-none cursor-pointer leading-7" onClick={toggleExtend}>{ expand ? t('collapseText') : t('expandText') }</span>
            }
        </div>
    )
}
