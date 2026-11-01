import { useEffect, useState } from 'react';
import type { PlanFormValues } from '../components/PlanForm';
import type { Plan } from '../models/Plan';
import { memberRepository, planRepository } from '../repositories/activeRepositories';
import { logAudit } from '../utils/auditLog';
import { nowInPhilippineTime } from '../utils/dateTime';

/** Names of the membership plans, for dropdowns; empty until the plans have loaded. */
export function usePlanNames(): string[] {
    const [names, setNames] = useState<string[]>([]);

    useEffect(() => {
        return planRepository.subscribe(
            (data) => setNames(data.map((plan) => plan.name)),
            () => setNames([])
        );
    }, []);

    return names;
}

export function usePlansViewModel() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    useEffect(() => {
        return planRepository.subscribe(
            (data) => {
                setPlans(data);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
    }, []);

    const startEditing = (plan: Plan) => setEditingPlan(plan);
    const cancelEditing = () => setEditingPlan(null);

    const submitPlan = async (values: PlanFormValues) => {
        const timestamp = nowInPhilippineTime();
        if (editingPlan) {
            await planRepository.update(editingPlan.id, { ...values, date_updated: timestamp });
            // Subscribers store the plan by name, so a rename has to carry over to them.
            if (values.name !== editingPlan.name) {
                const members = await memberRepository.getAll();
                for (const member of members.filter((entry) => entry.plan === editingPlan.name)) {
                    await memberRepository.update(member.id, { plan: values.name, date_updated: timestamp });
                }
            }
            await logAudit(values.name, 'Updated membership plan');
            setEditingPlan(null);
        } else {
            await planRepository.add({ ...values, date_created: timestamp, date_updated: timestamp });
            await logAudit(values.name, 'Added membership plan');
        }
    };

    const removePlan = async (plan: Plan) => {
        await planRepository.remove(plan.id);
        await logAudit(plan.name, 'Removed membership plan');
    };

    return { plans, loading, error, editingPlan, startEditing, cancelEditing, submitPlan, removePlan };
}
