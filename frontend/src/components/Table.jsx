import './Table.css';
import { Checkbox } from './Checkbox';
import { Badge } from './Badge';
import { Button } from './Button';

export function Table({ candidates = [], selectedIds = [], onToggleSelect, onViewDetails }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Team</th>
                    <th>Stage</th>
                    <th>Attendance</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                        <td>
                            <Checkbox
                                checked={selectedIds.includes(candidate.id)}
                                onChange={()=> onToggleSelect(candidate.id)}
                            />
                        </td>
                        <td>{candidate.name}</td>
                        <td>{candidate.team}</td>
                        <td>
                            <Badge stage={candidate.stage}/>
                        </td>
                        <td>{candidate.attendance}</td>
                        <td>
                            <Button variant="primary" onClick={() => onViewDetails(candidate.id)}>
                                View Details 
                            </Button>
                        </td>
                    </tr>
                )
                )}
            </tbody>
        </table>
    );
}