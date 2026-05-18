import React from 'react';
import { Input, Select, Tag } from 'antd';
import { t } from 'tailchat-shared';
import {
  DefaultFullModalTextAreaEditorRender,
  FullModalField,
  FullModalFieldEditorRenderComponent,
} from '@/components/FullModal/Field';
import { regUserExtraInfo } from './reg';

const PROFILE_STATUS_OPTIONS = [
  { value: 'student', label: t('学生') },
  { value: 'working', label: t('在职') },
  { value: 'freelance', label: t('自由职业') },
  { value: 'seeking', label: t('正在寻找机会') },
  { value: 'other', label: t('其他') },
];

const GENDER_OPTIONS = [
  { value: 'female', label: t('女') },
  { value: 'male', label: t('男') },
  { value: 'other', label: t('其他') },
  { value: 'private', label: t('不公开') },
];

let hasRegisteredCoreUserExtraInfo = false;

function getOptionLabel(
  options: Array<{ value: string; label: string }>,
  value: unknown
) {
  return options.find((item) => item.value === value)?.label ?? '';
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item !== '');
  }

  if (typeof value === 'string') {
    return value
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }

  return [];
}

const SelectEditor =
  (
    options: Array<{ value: string; label: string }>
  ): FullModalFieldEditorRenderComponent =>
  ({ value, onChange }) =>
    (
      <Select
        allowClear={true}
        className="w-full"
        value={value || undefined}
        onChange={(val) => onChange(val ?? '')}
      >
        {options.map((item) => (
          <Select.Option key={item.value} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    );

const TagsEditor: FullModalFieldEditorRenderComponent = ({
  value,
  onChange,
}) => (
  <Input
    value={value}
    placeholder={t('使用逗号分隔多个标签')}
    onChange={(e) => onChange(e.target.value)}
  />
);

const BirthdayEditor: FullModalFieldEditorRenderComponent = ({
  value,
  onChange,
}) => (
  <Input
    value={value}
    placeholder="YYYY-MM-DD"
    onChange={(e) => onChange(e.target.value)}
  />
);

function renderText(value: unknown) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) {
    return null;
  }

  return (
    <div className="whitespace-pre-wrap break-words select-text">{text}</div>
  );
}

function renderLink(value: unknown) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) {
    return null;
  }

  const href = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  return (
    <a
      className="break-all"
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {text}
    </a>
  );
}

function renderTags(value: unknown) {
  const tags = parseTags(value);
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((item) => (
        <Tag key={item} className="m-0">
          {item}
        </Tag>
      ))}
    </div>
  );
}

export function registerCoreUserExtraInfo() {
  if (hasRegisteredCoreUserExtraInfo) {
    return;
  }

  hasRegisteredCoreUserExtraInfo = true;

  regUserExtraInfo({
    name: 'bio',
    label: t('个人介绍'),
    component: {
      editor: ({ value, onSave }) => (
        <FullModalField
          title={t('个人介绍')}
          value={typeof value === 'string' ? value : ''}
          editable={true}
          renderEditor={DefaultFullModalTextAreaEditorRender}
          onSave={onSave}
        />
      ),
      render: ({ value }) => renderText(value),
    },
  });

  regUserExtraInfo({
    name: 'profileStatus',
    label: t('当前状态'),
    component: {
      editor: ({ value, onSave }) => (
        <FullModalField
          title={t('当前状态')}
          value={typeof value === 'string' ? value : ''}
          content={getOptionLabel(PROFILE_STATUS_OPTIONS, value)}
          editable={true}
          renderEditor={SelectEditor(PROFILE_STATUS_OPTIONS)}
          onSave={onSave}
        />
      ),
      render: ({ value }) => {
        const label = getOptionLabel(PROFILE_STATUS_OPTIONS, value);
        return label ? <span>{label}</span> : null;
      },
    },
  });

  regUserExtraInfo({
    name: 'gender',
    label: t('性别'),
    component: {
      editor: ({ value, onSave }) => (
        <FullModalField
          title={t('性别')}
          value={typeof value === 'string' ? value : ''}
          content={getOptionLabel(GENDER_OPTIONS, value)}
          editable={true}
          renderEditor={SelectEditor(GENDER_OPTIONS)}
          onSave={onSave}
        />
      ),
      render: ({ value }) => {
        const label = getOptionLabel(GENDER_OPTIONS, value);
        return label ? <span>{label}</span> : null;
      },
    },
  });

  regUserExtraInfo({
    name: 'birthday',
    label: t('生日'),
    component: {
      editor: ({ value, onSave }) => (
        <FullModalField
          title={t('生日')}
          value={typeof value === 'string' ? value : ''}
          editable={true}
          renderEditor={BirthdayEditor}
          onSave={onSave}
        />
      ),
    },
  });

  regUserExtraInfo({
    name: 'education',
    label: t('学校/专业'),
  });

  regUserExtraInfo({
    name: 'company',
    label: t('公司/组织'),
  });

  regUserExtraInfo({
    name: 'jobTitle',
    label: t('职位/角色'),
  });

  regUserExtraInfo({
    name: 'website',
    label: t('个人网站'),
    component: {
      render: ({ value }) => renderLink(value),
    },
  });

  regUserExtraInfo({
    name: 'interests',
    label: t('兴趣标签'),
    component: {
      editor: ({ value, onSave }) => (
        <FullModalField
          title={t('兴趣标签')}
          value={parseTags(value).join(', ')}
          editable={true}
          renderEditor={TagsEditor}
          onSave={onSave}
        />
      ),
      render: ({ value }) => renderTags(value),
    },
  });
}
