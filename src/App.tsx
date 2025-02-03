import React, { useEffect, useState } from "react";
import "./App.scss";

interface TimeEntry {
  id: number;
  employee: string;
  inTime: string;
  outTime: string;
  totalHours?: number;
}

const calculateTotalHours = (inTime: string, outTime: string): number => {
  const inDate = new Date(`1970-01-01T${inTime}:00`);
  const outDate = new Date(`1970-01-01T${outTime}:00`);
  const diffMinutes = (outDate.getTime() - inDate.getTime()) / (1000 * 60);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  // Convert minutes to proper format
  return hours + minutes / 100;
};

const sumTotalWorkHours = (entries: TimeEntry[]) => {
  const totalMinutes = entries.reduce((sum, entry) => {
    const totalHours = entry.totalHours || 0;
    const hours = Math.floor(totalHours);
    const minutes = (totalHours - hours) * 100;
    return sum + hours * 60 + Math.round(minutes);
  }, 0);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  // Format properly

  return `${totalHours}:${remainingMinutes.toString().padStart(2, "0")}`;
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([
    {
      id: 1,
      employee: "John Doe",
      inTime: "09:00",
      outTime: "17:00",
      totalHours: 8,
    },
  ]);

  useEffect(() => {
    const storedEntries = localStorage.getItem("entries");

    if (!storedEntries) {
      localStorage.setItem("entries", JSON.stringify(entries));
    } else {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  const handleAddEntry = () => {
    const newEntry: TimeEntry = {
      id: entries.length + 1,
      employee: "New_Employee",
      inTime: "00:00",
      outTime: "00:00",
      totalHours: 0,
    };

    setEntries((preEntity) => {
      const updatedEntries = [...preEntity, newEntry];
      localStorage.setItem("entries", JSON.stringify(updatedEntries));
      return updatedEntries;
    });
  };

  const handleEditEntry = (
    id: number,
    field: keyof TimeEntry,
    value: string
  ) => {
    const updatedEntries = entries.map((entry) => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };
        updatedEntry.totalHours = calculateTotalHours(
          updatedEntry.inTime,
          updatedEntry.outTime
        );

        return updatedEntry;
      }
      return entry;
    });

    setEntries(updatedEntries);
    localStorage.setItem("entries", JSON.stringify(updatedEntries));
  };

  const handleDeleteEntry = (id: number) => {
    const filteredEntries = entries.filter((entry) => entry.id !== id);
    setEntries(filteredEntries);
    localStorage.setItem("entries", JSON.stringify(filteredEntries));
  };

  return (
    <div className="tyme-container">
      <div className="tyme">
        <h1>Tyme - Work Hours</h1>
        <button onClick={handleAddEntry} className="btn__add">
          Add Entry
        </button>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>In-Time</th>
              <th>Out-Time</th>
              <th>Total Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <input
                    type="text"
                    value={entry.employee}
                    onChange={(e) =>
                      handleEditEntry(entry.id, "employee", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={entry.inTime}
                    onChange={(e) =>
                      handleEditEntry(entry.id, "inTime", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={entry.outTime}
                    onChange={(e) =>
                      handleEditEntry(entry.id, "outTime", e.target.value)
                    }
                  />
                </td>
                <td>{entry.totalHours?.toFixed(2)}</td>
                <td>
                  <button
                    className="btn__delete"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="total-work-hours">
          Total Work Hours: <span>{sumTotalWorkHours(entries)}</span>
        </h2>
      </div>
    </div>
  );
};

export default App;
