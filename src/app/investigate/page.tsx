"use client";

// Mockdata: Heaviest mass available 23000000

const HEAVIEST_POSSIBLE_MASS = 25_000_000;

import { Combo } from "@/components/combo";
import {
  IAsteroidLookupInfo,
  useAsteroidLookup,
} from "../model/useAsteroidLookup";
import { useEffect, useState } from "react";
import { MapModal } from "./map";
import { LocationIcon } from "./location-icon";
import OwnStyles from "./investigate.module.css";

const Investigate = () => {
  const model = useAsteroidLookup();
  const [incidents, setIncidents] = useState<IAsteroidLookupInfo[]>([]);
  const [isMassEnabled, setMassEnabled] = useState(false);

  const [selectedIncident, setSelectedIncident] =
    useState<IAsteroidLookupInfo>();
  const [tableFilter, setTableFilter] = useState("");
  let tableRef: HTMLTableElement | null = null;

  useEffect(() => {
    if (tableRef && tableFilter) {
      const target = (tableRef as HTMLTableElement).querySelector(
        `[data-name*="${tableFilter.toLowerCase()}"`
      );
      if (target) {
        const offset = (target as HTMLElement).offsetTop;
        tableRef.scrollTo({ top: offset - 50, behavior: "smooth" });
      }
    }
  }, [tableFilter, tableRef]);

  if (!model || model.isLoading) {
    return "";
  }

  const {
    knownYears,
    getByYear,
    getByYearRange,
    startYear,
    endYear,
    setStartYear,
    setEndYear,
    minMass: mass,
    setMinMass: setMass,
  } = model || {};

  const incidentsDataProvider = (year: string) => {
    const incidents = getByYear?.(Number(year));
    const count = incidents?.length;
    return {
      label: count ? `(${count}) incidents` : "",
      value: year,
    };
  };

  const submitSearch = () => {
    const incidents = getByYearRange(
      startYear,
      endYear,
      isMassEnabled ? mass : 0
    );
    setIncidents(incidents);
    setTableFilter("");
  };

  return (
    <>
      <div data-page="investigate" className={OwnStyles.stack}>
        <h1>Investigate</h1>
        <div className={OwnStyles.hStack}>
          <label>Time frame</label>
          <Combo
            initialValue={startYear.toString()}
            onSelect={setStartYear}
            dataTransformer={incidentsDataProvider}
            data={knownYears?.values || []}
          />
          <label>&rarr;</label>
          <Combo
            initialValue={endYear.toString()}
            onSelect={setEndYear}
            dataTransformer={incidentsDataProvider}
            data={knownYears?.values || []}
          />
        </div>
        <div className={OwnStyles.hStack}>
          <label>Minimal Mass</label>
          <input
            type="checkbox"
            checked={isMassEnabled}
            onChange={(e) => setMassEnabled(e.target.checked)}
          />
          <input
            disabled={!isMassEnabled}
            type="range"
            min={0}
            max={HEAVIEST_POSSIBLE_MASS}
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
          />
          <input
            disabled={!isMassEnabled}
            type="number"
            min={0}
            max={HEAVIEST_POSSIBLE_MASS}
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
          />
        </div>
        <button onClick={submitSearch}>Search</button>
        {model.errorMessage && <span className={OwnStyles.errorMessage}>{model.errorMessage}</span>}
        <MapModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(undefined)}
        />
        {incidents.length ? (
          <>
            <div className={OwnStyles.tableContainer}>
              <table
                className={OwnStyles.stickyTable}
                ref={(target) => (tableRef = target)}
              >
                <thead>
                  <tr>
                    <th data-label="year">Year</th>
                    <th data-label="name">Name</th>
                    <th data-label="mass">Mass</th>
                    <th data-label="fell">Fall</th>
                    <th data-label="geo">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((entry, idx) => (
                    <tr key={idx} data-name={entry.name.toLowerCase()}>
                      <td data-label="year">{entry.actualYear}</td>
                      <td data-label="name">
                        <span
                          data-class={entry.recclass}
                          className={OwnStyles.nameWithTag}
                        >
                          {entry.name}
                        </span>
                      </td>
                      <td data-label="mass">{entry.mass.toFixed(2)}</td>
                      <td data-label="fall">{entry.fall}</td>
                      <td data-label="geo">
                        {!entry.reclat || !entry.reclong ? (
                          <>No location</>
                        ) : (
                          <>
                            {entry.reclat}, {entry.reclong}
                            <LocationIcon
                              width="24"
                              height="16"
                              onClick={() => setSelectedIncident(entry)}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <input
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
                className={OwnStyles.tableSearch}
                type="search"
                placeholder="Find..."
              ></input>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Investigate;