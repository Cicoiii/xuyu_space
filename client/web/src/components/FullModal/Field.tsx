import React, { useState, useCallback, useEffect } from 'react';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { Input } from 'antd';
import { t } from 'tailchat-shared';
import { TipIcon } from '../TipIcon';
import styles from './FullModal.module.less';

export type FullModalFieldEditorRenderComponent = React.FC<{
  value: string;
  onChange: (val: string) => void;
}>;

interface FullModalFieldProps {
  /**
   * 字段标题
   */
  title: React.ReactNode;

  /**
   * 提示信息
   */
  tip?: React.ReactNode;

  /**
   * 字段内容
   * 如果没有则向下取value的值
   */
  content?: React.ReactNode;

  /**
   * 是否可编辑
   */
  editable?: boolean;

  /**
   * 如果可编辑则必填
   * 用于告知组件当前的值
   */
  value?: string;

  /**
   * 渲染编辑视图的编辑器
   */
  renderEditor?: FullModalFieldEditorRenderComponent;

  /**
   * 编辑完成后的回调
   */
  onSave?: (val: string) => void;
}

/**
 * 计算要显示的title
 */
function useTitle(value?: string) {
  return _isString(value) ? value : undefined;
}

/**
 * 字段编辑器
 */
const FullModalFieldEditor: React.FC<FullModalFieldProps> = React.memo(
  (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingValue, setEditingValue] = useState(props.value ?? '');
    const valueTitle = useTitle(props.value);

    useEffect(() => {
      setEditingValue(props.value ?? '');
    }, [props.value]);

    const handleEditing = useCallback(() => {
      setIsEditing(!isEditing);
    }, [isEditing]);

    const handleSave = useCallback(() => {
      props.onSave?.(editingValue);
      setIsEditing(false);
    }, [props.onSave, editingValue]);

    const EditorComponent = props.renderEditor;

    return (
      <div className="flex w-full items-center">
        {/* 内容 */}
        <div className="truncate flex-1">
          {isEditing && !_isNil(EditorComponent) ? (
            <EditorComponent value={editingValue} onChange={setEditingValue} />
          ) : (
            <span className="select-text" title={valueTitle}>
              {props.content ?? props.value}
            </span>
          )}
        </div>

        {/* 操作 */}
        <div className={styles.editorActions}>
          {!isEditing ? (
            <div
              className={styles.editorBtn}
              onClick={handleEditing}
              title={t('编辑')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          ) : (
            <>
              <div
                className={styles.editorBtn}
                onClick={handleEditing}
                title={t('取消')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div
                className={clsx(styles.editorBtn, styles.editorBtnPrimary)}
                onClick={handleSave}
                title={t('保存变更')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);
FullModalFieldEditor.displayName = 'FullModalFieldEditor';

// Need clsx import for the editor
import clsx from 'clsx';

export const FullModalField: React.FC<FullModalFieldProps> = React.memo(
  (props) => {
    const valueTitle = useTitle(props.value);

    const allowEditor = props.editable === true && !_isNil(props.renderEditor);

    return (
      <div className={styles.fieldRow}>
        <div className={styles.fieldLabel}>
          <span>{props.title}</span>
          {props.tip && (
            <span className="ml-1 text-sm">
              <TipIcon content={props.tip} />
            </span>
          )}
        </div>
        <div className={styles.fieldValue}>
          {allowEditor === true ? (
            <FullModalFieldEditor {...props} />
          ) : (
            <span className="select-text" title={valueTitle}>
              {props.content ?? props.value}
            </span>
          )}
        </div>
      </div>
    );
  }
);
FullModalField.displayName = 'FullModalField';

/**
 * 默认的输入框字段编辑器
 */
export const DefaultFullModalInputEditorRender: FullModalFieldEditorRenderComponent =
  ({ value, onChange }) => (
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  );

/**
 * 默认的多行输入框字段编辑器
 */
export const DefaultFullModalTextAreaEditorRender: FullModalFieldEditorRenderComponent =
  ({ value, onChange }) => (
    <Input.TextArea
      autoSize={{ minRows: 2, maxRows: 6 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
