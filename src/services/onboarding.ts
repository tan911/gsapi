import { OnboardingFlow, OnboardingStep } from '@/types/onboarding'

export class OnboardingService {
    private static readonly CLIENT_STEPS: OnboardingStep[] = [
        {
            id: 1,
            name: 'location',
            title: 'Where are you located?',
            description: 'Help us find artists near you',
            isRequired: true,
            fields: [
                {
                    name: 'address',
                    type: 'text',
                    label: 'Street Address',
                    placeholder: '123 Main St',
                    required: true,
                },
                {
                    name: 'city',
                    type: 'text',
                    label: 'City',
                    placeholder: 'New York',
                    required: true,
                },
                {
                    name: 'state',
                    type: 'text',
                    label: 'State/Province',
                    placeholder: 'NY',
                    required: true,
                },
                {
                    name: 'country',
                    type: 'text',
                    label: 'Country',
                    placeholder: 'United States',
                    required: true,
                },
                {
                    name: 'postalCode',
                    type: 'text',
                    label: 'Postal Code',
                    placeholder: '10001',
                    required: false,
                },
            ],
        },
    ]

    private static readonly ARTIST_STEPS: OnboardingStep[] = [
        {
            id: 1,
            name: 'basic_info',
            title: 'Tell us about yourself',
            description: 'Help clients learn about your experience',
            isRequired: true,
            fields: [
                {
                    name: 'bio',
                    type: 'textarea',
                    label: 'Bio',
                    placeholder: 'Tell clients about your experience and style...',
                    required: true,
                },
                {
                    name: 'experienceYears',
                    type: 'number',
                    label: 'Years of Experience',
                    placeholder: '5',
                    required: false,
                },
            ],
        },
        {
            id: 2,
            name: 'services',
            title: 'What services do you offer?',
            description: 'Add the services clients can book with you',
            isRequired: true,
            fields: [
                {
                    name: 'services',
                    type: 'text', // This would be handled as a dynamic array in frontend
                    label: 'Services',
                    placeholder: 'e.g., Haircut, Wedding Photography',
                    required: true,
                },
            ],
        },
        {
            id: 3,
            name: 'location_and_travel',
            title: 'Location & Service Area',
            description: 'Where do you provide services?',
            isRequired: true,
            fields: [
                {
                    name: 'address',
                    type: 'text',
                    label: 'Business Address',
                    required: true,
                },
                {
                    name: 'city',
                    type: 'text',
                    label: 'City',
                    required: true,
                },
                {
                    name: 'state',
                    type: 'text',
                    label: 'State/Province',
                    required: true,
                },
                {
                    name: 'country',
                    type: 'text',
                    label: 'Country',
                    required: true,
                },
                {
                    name: 'travelRadiusKm',
                    type: 'number',
                    label: 'Travel Radius (km)',
                    placeholder: '25',
                    required: true,
                },
            ],
        },
    ]

    public static getId(userRole: 'client' | 'artist', name: string) {
        const steps = userRole === 'client' ? this.CLIENT_STEPS : this.ARTIST_STEPS

        return steps.find((step) => step.name === name)?.id || null
    }

    public static getStep(userRole: 'client' | 'artist', stepId: number): OnboardingStep | null {
        const steps = userRole === 'client' ? this.CLIENT_STEPS : this.ARTIST_STEPS

        return steps.find((step) => step.id === stepId) || null
    }

    public static getFlow(userRole: 'client' | 'artist', currentStep: number = 1): OnboardingFlow {
        const steps = userRole === 'client' ? this.CLIENT_STEPS : this.ARTIST_STEPS

        return {
            totalSteps: steps.length,
            steps,
            currentStep,
            completedSteps: this.getCompletedSteps(currentStep),
            isCompleted: currentStep > steps.length,
        }
    }

    /* Check if onboarding is complete */
    public static isOnboardingComplete(
        userRole: 'client' | 'artist',
        currentStep: number
    ): boolean {
        const steps = userRole === 'client' ? this.CLIENT_STEPS : this.ARTIST_STEPS

        return currentStep > steps.length
    }
    /**
     * Get the next step
     */
    static getNextStep(
        userRole: 'client' | 'artist',
        currentStepId: number
    ): OnboardingStep | null {
        const steps = userRole === 'client' ? this.CLIENT_STEPS : this.ARTIST_STEPS
        const nextStepId = currentStepId + 1

        return steps.find((step) => step.id === nextStepId) || null
    }

    /**
     * Helper: Get completed steps array
     */
    private static getCompletedSteps(currentStep: number): number[] {
        return Array.from({ length: currentStep - 1 }, (_, i) => i + 1)
    }
}
