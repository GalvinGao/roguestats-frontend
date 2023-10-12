import { InputAdornment } from "@mui/material"
import TextField, { TextFieldProps } from "@mui/material/TextField"
import {
  BaseInputTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  ariaDescribedByIds,
  examplesId,
  getInputProps,
  labelValue,
} from "@rjsf/utils"
import clsx from "clsx"
import { ChangeEvent, FocusEvent } from "react"
import MdiFormTextbox from "~icons/mdi/form-textbox"
import MdiNumeric from "~icons/mdi/numeric"

const TYPES_THAT_SHRINK_LABEL = ["date", "datetime-local", "file", "time"]

/** The `BaseInputTemplate` is the template to use to render the basic `<input>` component for the `core` theme.
 * It is used as the template for rendering many of the <input> based widgets that differ by `type` and callbacks only.
 * It can be customized/overridden for other themes or individual implementations as needed.
 *
 * @param props - The `WidgetProps` for this template
 */
export default function BaseInputTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: BaseInputTemplateProps<T, S, F>) {
  const {
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    name, // remove this from textFieldProps
    placeholder,
    required,
    readonly,
    disabled,
    type,
    label,
    hideLabel,
    value,
    onChange,
    onChangeOverride,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    uiSchema,
    rawErrors = [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registry,
    InputLabelProps,
    ...textFieldProps
  } = props
  const inputProps = getInputProps<T, S, F>(schema, type, options)
  // Now we need to pull out the step, min, max into an inner `inputProps` for material-ui
  const { step, min, max, ...rest } = inputProps
  const otherProps = {
    inputProps: {
      step,
      min,
      max,
      ...(schema.examples ? { list: examplesId<T>(id) } : undefined),
    },
    ...rest,
  }
  const _onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    onChange(value === "" ? options.emptyValue : value)
  const _onBlur = ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
    onBlur(id, value)
  const _onFocus = ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
    onFocus(id, value)
  const DisplayInputLabelProps = TYPES_THAT_SHRINK_LABEL.includes(type)
    ? {
        ...InputLabelProps,
        shrink: true,
      }
    : InputLabelProps

  return (
    <>
      <TextField
        id={id}
        name={id}
        placeholder={placeholder}
        label={labelValue(label || undefined, hideLabel, false)}
        autoFocus={autofocus}
        required={required}
        disabled={disabled || readonly}
        {...otherProps}
        value={value || value === 0 ? value : ""}
        error={rawErrors.length > 0}
        onChange={onChangeOverride || _onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        onWheel={e => {
          e.preventDefault()
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {{
                number: <MdiNumeric className="w-6 h-6" />,
                string: <MdiFormTextbox className="w-6 h-6" />,
              }[otherProps.type] ?? <MdiFormTextbox className="w-6 h-6" />}
            </InputAdornment>
          ),
          className: clsx(
            textFieldProps.className,
            otherProps.type === "number" && "font-mono",
          ),
        }}
        InputLabelProps={DisplayInputLabelProps}
        {...(textFieldProps as TextFieldProps)}
        aria-describedby={ariaDescribedByIds<T>(id, !!schema.examples)}
      />
      {Array.isArray(schema.examples) && (
        <datalist id={examplesId<T>(id)}>
          {(schema.examples as string[])
            .concat(
              schema.default && !schema.examples.includes(schema.default)
                ? ([schema.default] as string[])
                : [],
            )
            .map((example: any) => {
              return <option key={example} value={example} />
            })}
        </datalist>
      )}
    </>
  )
}
