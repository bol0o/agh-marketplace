'use client';

import { useRouter } from 'next/navigation';
import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface DelayedLinkProps extends LinkProps {
	children: ReactNode;
	className?: string;
	delay?: number;
	onClick?: () => void;
}

export function DelayedLink({
	href,
	children,
	className,
	delay = 300,
	onClick,
	...props
}: DelayedLinkProps) {
	const router = useRouter();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		if (onClick) {
			onClick();
		}

		setTimeout(() => {
			router.push(href.toString());
		}, delay);
	};

	return (
		<Link href={href} className={className} onClick={handleClick} {...props}>
			{children}
		</Link>
	);
}
