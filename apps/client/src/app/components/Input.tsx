import React from 'react';

type InputVariant = 'primary' | 'outline' | 'secondary';

interface BaseProps {
	id: string;
	register?: (name: string) => Record<string, unknown>;
	className?: string;
	variant?: InputVariant;
}

type InputProps = BaseProps &
	React.InputHTMLAttributes<HTMLInputElement> & {
		as?: 'input';
	};

type TextAreaProps = BaseProps &
	React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
		as: 'textarea';
	};

type Props = InputProps | TextAreaProps;

const baseClasses =
	'w-full py-2 px-3 rounded-md transition-all duration-300 outline-none shadow-md focus:shadow-lg';

const variantClasses: Record<InputVariant, string> = {
	primary: 'border border-black bg-white text-black focus:border-neutral-800',
	outline:
		'border border-black bg-transparent text-black focus:bg-black focus:text-white',
	secondary:
		'border border-neutral-200 bg-neutral-100 text-black focus:border-neutral-400',
};

const Input: React.FC<Props> = ({
	id,
	register,
	className = '',
	variant = 'primary',
	as = 'input',
	...rest
}) => {
	const commonProps = {
		id,
		...(register ? register(id) : {}),
		className: `${baseClasses} ${variantClasses[variant]} mt-1 ${className}`,
		...rest,
	};

	if (as === 'textarea') {
		return (
			<textarea
				{...(commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
			/>
		);
	}

	return (
		<input
			{...(commonProps as React.InputHTMLAttributes<HTMLInputElement>)}
		/>
	);
};

export default Input;
