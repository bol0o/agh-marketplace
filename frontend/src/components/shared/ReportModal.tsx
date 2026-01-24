'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import styles from './ReportModal.module.scss';

interface ReportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (reason: string, description: string) => Promise<void>;
	targetName?: string;
	targetType?: 'user' | 'product';
	isSubmitting?: boolean;
}

const REPORT_REASONS = [
	{ id: 'spam', label: 'Spam lub nieodpowiednie treści' },
	{ id: 'harassment', label: 'Nękanie lub groźby' },
	{ id: 'fake_account', label: 'Fałszywe konto' },
	{ id: 'inappropriate_behavior', label: 'Nieodpowiednie zachowanie' },
	{ id: 'scam', label: 'Oszustwo lub próba wyłudzenia' },
	{ id: 'other', label: 'Inne' },
];

export function ReportModal({
	isOpen,
	onClose,
	onSubmit,
	targetName,
	targetType = 'user',
	isSubmitting = false,
}: ReportModalProps) {
	const [selectedReason, setSelectedReason] = useState('');
	const [description, setDescription] = useState('');
	const [customReason, setCustomReason] = useState('');

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const finalReason = selectedReason === 'other' 
			? customReason 
			: REPORT_REASONS.find(r => r.id === selectedReason)?.label || selectedReason;
		
		await onSubmit(finalReason, description);
		
		if (!isSubmitting) {
			setSelectedReason('');
			setDescription('');
			setCustomReason('');
		}
	};

	const getTitle = () => {
		if (targetName) {
			return `Zgłoś ${targetType === 'user' ? 'użytkownika' : 'produkt'}: ${targetName}`;
		}
		return `Zgłoś ${targetType === 'user' ? 'użytkownika' : 'produkt'}`;
	};

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modal}>
				<div className={styles.modalHeader}>
					<AlertTriangle className={styles.warningIcon} size={24} />
					<h3 className={styles.modalTitle}>{getTitle()}</h3>
					<button className={styles.closeButton} onClick={onClose} aria-label="Zamknij">
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					<p className={styles.instruction}>
						Prosimy o wybranie powodu zgłoszenia i podanie szczegółów. Każde zgłoszenie
						jest weryfikowane przez nasz zespół.
					</p>

					<div className={styles.formGroup}>
						<label className={styles.label}>
							Wybierz powód zgłoszenia *
						</label>
						<div className={styles.reasonsGrid}>
							{REPORT_REASONS.map((reason) => (
								<label key={reason.id} className={styles.reasonOption}>
									<input
										type="radio"
										name="reportReason"
										value={reason.id}
										checked={selectedReason === reason.id}
										onChange={(e) => setSelectedReason(e.target.value)}
										className={styles.radioInput}
										required
									/>
									<span className={styles.radioCustom}></span>
									<span className={styles.reasonLabel}>{reason.label}</span>
								</label>
							))}
						</div>
					</div>

					{selectedReason === 'other' && (
						<div className={styles.formGroup}>
							<label className={styles.label} htmlFor="customReason">
								Podaj inny powód *
							</label>
							<input
								id="customReason"
								type="text"
								value={customReason}
								onChange={(e) => setCustomReason(e.target.value)}
								className={styles.input}
								placeholder="Opisz swój powód zgłoszenia"
								required
							/>
						</div>
					)}

					<div className={styles.formGroup}>
						<label className={styles.label} htmlFor="description">
							Dodatkowe informacje (opcjonalnie)
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className={styles.textarea}
							placeholder="Podaj więcej szczegółów, które pomogą nam w weryfikacji zgłoszenia..."
							rows={4}
							maxLength={500}
						/>
						<div className={styles.charCounter}>
							{description.length}/500 znaków
						</div>
					</div>

					<div className={styles.modalActions}>
						<button
							type="button"
							onClick={onClose}
							className={styles.cancelButton}
							disabled={isSubmitting}
						>
							Anuluj
						</button>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={isSubmitting || !selectedReason || (selectedReason === 'other' && !customReason)}
						>
							{isSubmitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}