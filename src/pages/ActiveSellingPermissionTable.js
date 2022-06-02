import React, { useEffect, useMemo, useCallback, useState } from "react";
import Container from "components/ui/container";
import Spinner from "components/ui/Spinner/index";
import { useSortBy, useTable } from "react-table";
import analyticsService from "services/analyticsService";
import styles from "./ActiveSellingPermissionTable.module.scss";
import ActiveSellingPermissionFilter from "./ActiveSellingPermissionFilter";
import clientService from "services/clientsService";
import Sort from "components/icons/sort-arrow";
import SortUp from "components/icons/sort-arrow-up";
import SortDown from "components/icons/sort-arrow-down";
import LableGroupCard from "components/ui/LableGroupCard";

const mockDtata = [{ "producerId": "3394617", "businessUnit": "Cornerstone Senior marketing", "carrier": "SummaCare", "state": "OH", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "AL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "AL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "GA", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "GA", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "MD", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "MD", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "MO", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "MO", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "OH", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "OH", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "SC", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "SC", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "TN", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "TN", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "TX", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Aetna", "state": "TX", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "AL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "AL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "AZ", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "AZ", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "FL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "FL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "GA", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "GA", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "KY", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "KY", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "MD", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "MD", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "MI", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "MI", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "MO", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "MO", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "MS", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "MS", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "OH", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "OH", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "SC", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "SC", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "TN", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "TN", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "TX", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Centene", "state": "TX", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "AL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "AL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "AZ", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "AZ", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "FL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "FL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "GA", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "GA", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "KY", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "KY", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "MD", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "MD", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "MI", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "MI", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "MO", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "MO", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "MS", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "MS", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "OH", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "OH", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "SC", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "SC", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "TN", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "TN", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "TX", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "3394617", "businessUnit": "Nevada Insurance", "carrier": "Wellcare", "state": "TX", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "AL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "AZ", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "FL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "GA", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "MD", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "MO", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "MS", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "OH", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "SC", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "TN", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "B442738", "businessUnit": "Premier Marketing", "carrier": "Cigna", "state": "TX", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "AL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "AL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "FL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "FL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "GA", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "GA", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "KY", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "KY", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "MD", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "MD", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "MO", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "MO", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "MS", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "MS", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "OH", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "OH", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "SC", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "SC", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "TN", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "TN", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "TX", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "2222317", "businessUnit": "Premier Marketing", "carrier": "UnitedHealthcare", "state": "TX", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "GA", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "GA", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "KY", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "KY", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "KY", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "MO", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "MO", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "MO", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "OH", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "OH", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "OH", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "TN", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "TN", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "TX", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "TX", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "KFGPHKTSSZ", "businessUnit": "Tidewater Management Group", "carrier": "Anthem", "state": "TX", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "AL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "AL", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "AL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "AZ", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "AZ", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "AZ", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "FL", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "FL", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "FL", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "GA", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "GA", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "GA", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "KY", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "KY", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "KY", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MD", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MD", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MD", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MI", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MI", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MI", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MO", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MO", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MO", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MS", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MS", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "MS", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "OH", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "OH", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "OH", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "TN", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "TN", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "TN", "planType": "PDP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "TX", "planType": "MA", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "TX", "planType": "MEDIGAP", "status": "Y", "planYear": 2022 }, { "producerId": "1555549", "businessUnit": "Tidewater Management Group", "carrier": "Humana", "state": "TX", "planType": "PDP", "status": "Y", "planYear": 2022 }]
const uniqValues = (array) => Array.from(new Set(array))

export default function ActiveSellingPermissionTable({ npn }) {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoadings] = useState(true);
  const [error, setError] = useState(null);
  useEffect(
    function () {
      if (!npn) return;

      setIsLoadings(true);
      clientService
        .getAgents(npn)
        .then((resp) => {
          setIsLoadings(false);
          setError(null);
          setAgents(resp);
        })
        .catch((err) => {
          setIsLoadings(false);
          //setError(err);
          setAgents(mockDtata);
          console.error("Error fetching Agents", err);
        });
    },
    [npn]
  );

  const uniqAgenets = useMemo(() =>
    Object.values(agents.reduce((acc, row) => {
      const { businessUnit, carrier, planType, planYear, producerId, state, status } = row
      const key = `${carrier}-${producerId}-${planYear}`
      acc[key] = {
        businessUnit,
        carrier,
        planTypes: uniqValues([...(acc[key]?.planTypes ?? []), planType]),
        planYear,
        producerId,
        status,
        states: uniqValues([...(acc[key]?.states ?? []), state]),
      };
      return acc;
    }, {})), [agents])

  const filterOptions = useMemo(() => agents.reduce((acc, row) => {
    const { carrier, planType, state } = row
    return {
      'Carrier': uniqValues([carrier, ...(acc?.Carrier ?? [])]),
      'State': uniqValues([state, ...(acc?.State ?? [])]),
      'PlanType': uniqValues([planType, ...(acc?.PlanType ?? [])]),
    }
  }, {}), [agents])

  const handleChangeTable = useCallback(function () { }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Carrier",
        accessor: "carrier",
        Cell: ({ value, row }) => {
          return <div className={styles.carrierName}>{value}</div>;
        },
      },
      {
        Header: "States",
        accessor: "states",
        disableSortBy: true,
        Cell: ({ value, row }) => {
          return <div>{value?.join(', ')}</div>;
        },
      },
      {
        Header: "Plan type",
        accessor: "planTypes",
        disableSortBy: true,
        Cell: ({ value, row }) => {
          return ( <LableGroupCard labelNames={value?.join(', ')} />);
        },
      },
      {
        Header: "Plan year",
        accessor: "planYear",
        Cell: ({ value, row }) => {
          return <div>{value}</div>;
        },
      },
      {
        Header: "Producer ID",
        accessor: "producerId",
        disableSortBy: true,
        Cell: ({ value, row }) => {
          return <div className={styles.carrierName}>{value}</div>;
        },
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <Table
      columns={columns}
      data={uniqAgenets}
      onChangeTableState={handleChangeTable}
      filterOptions={filterOptions}
    />
  );
}

function Table({
  columns,
  data,
  searchString,
  onChangeTableState,
  loading,
  sort,
  applyFilters,
  filterOptions
}) {
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({});

  const pageData = useMemo(() => {
    const shouldApplyFilters = [
      ...Object.keys(filters?.Carrier ?? {}).filter(id => (filters?.Carrier || {})[id]),
      ...Object.keys(filters?.State ?? {}).filter(id => (filters?.State || {})[id]),
      ...Object.keys(filters?.PlanType ?? {}).filter(id => (filters?.PlanType || {})[id]),
    ].length > 0
    const filteredData = shouldApplyFilters ? data.filter(row => {
      const { states, carrier, planTypes } = row
      const isStateMatched = states.filter(state => (filters?.State ?? {})[state]).length > 0;
      if (isStateMatched) return true;
      if ((filters?.Carrier || {})[carrier]) return true;
      const isPlantypeMatched = planTypes.filter(planType => (filters?.PlanType ?? {})[planType]).length > 0;
      if (isPlantypeMatched) return true;

      return false;
    })
      : [...data]
      setPageSize(pageSize => Math.min(data.length, pageSize + 10))
    return filteredData.splice(0, pageSize)
  }, [data, pageSize, filters])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
    {
      columns,
      data: pageData,
    },
    useSortBy,
  );

  const handleSeeMore = useCallback(() => {
    setPageSize(pageSize => Math.min(pageData.length, pageSize + 10))
  }, [pageData, setPageSize])

  useEffect(() => {
    analyticsService.fireEvent("event-content-load", {
      pagePath: "/list-view/",
    });
    onChangeTableState({
      searchString,
      sort,
      applyFilters,
    });
  }, [
    onChangeTableState,
    searchString,
    sort,
    applyFilters
  ]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="mt-scale-3">
      <div className={styles.headerContainer}>
        <div className={styles.tableHeading}>Active Selling Permissions</div>
        <ActiveSellingPermissionFilter onSubmit={setFilters} filterOptions={filterOptions} />
      </div>
      <div className={styles.tableWrapper}>
        <table
          data-gtm="contacts-list-wrapper"
          className={styles.table}
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="text-left">
                    <div className={styles["tb-headers"]}>
                      <span>{column.render("Header")}</span>
                      <span className={styles.sortingIcon}>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? <SortDown />
                            : <SortUp />
                          : column.disableSortBy ? '' : <Sort />}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className={styles["contact-table"]}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        <div className={styles["tb-cell"]}>
                          {cell.render("Cell")}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.length > pageSize && <button onClick={handleSeeMore} className={styles.seeMore}>See More</button>}
        <div className={styles.paginationResultsDisplay}>
          {`Showing ${rows.length} of ${data.length} Permissions`}
        </div>
      </div>
    </Container >
  );
}