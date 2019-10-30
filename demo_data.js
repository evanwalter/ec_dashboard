
function get_demo_data() {

	return [{id: 1,qid: "Q1",qtext: " How is the job situation in your neighborhood", 
					data:		[[30,15,15,36],[40,32,0,46]],
					item_points: ['Jobs are plentiful and easy to find',
								'Jobs are available but you have to search for them',
								'Jobs are scarce','Not sure'],
					items :['Male','Female']
					},
			  {id: 2,qid: "Q2_1",qtext: " How is the job situation in your state", 
					data:		[[30,15,15,36],[40,32,0,46]],
					item_points: ['Jobs are plentiful and easy to find',
								'Jobs are available but you have to search for them',
								'Jobs are scarce','Not sure'],
					items :['Male','Female']
					},
			  {id: 2,qid: "Q2_2",qtext: " How is the job situation in your local region", 
					data:		[[50,15,15,36],[40,32,0,46]],
					item_points: ['Jobs are plentiful and easy to find',
								'Jobs are available but you have to search for them',
								'Jobs are scarce','Not sure'],
					items :['Male','Female']
					},
			  {id: 3,qid: "Q3",qtext: "Which products have you purchased in the past 12 months?", 
					data:		[[96,75,74,66,40,32,24,16]],
					item_points: ['Product5','Product3','Product4','Product2','Product1','Product8','Product7','Product6'],
					items : undefined
					},
			  {id: 4,qid: "Q4",qtext: "Which products do you plan to purchased in the next 12 months?", 
					data:		[[80,75,65,61,53,51,47,46]],
					item_points: ['Product7','Product5','Product3','Product4','Product1','Product6','Product8','Product2'],
					items : undefined
					},
					{id: 5,qid: "Q5",qtext: "How likely are you to buy in any of the products in the next 12 months?", 
					data:		[[50,25,10,5,3]],
					item_points: ['Highly likely','Somewhat likely','Somewhat unlikely','Very unlikely','Not sure'],
					items : undefined
					},
					{id: 6,qid: "Q6",qtext: "Do you purchase any of these products regularly?", 
					data:		[[65,35]],
					item_points: ['Yes','No'],
					items : undefined
					},
					{id: 7,qid: "Q6b",qtext: "Have you any of these products at any time?", 
					data:		[[74,26]],
					item_points: ['Yes','No'],
					items : undefined
					},
					{id: 8,qid: "OverallSat",qtext: "Overall satisfaction with the product over the past 12 months?", 
					data:		[[87,85,88,85,79.90,87,85,88,85,79.90]],
					item_points: ['Jan','Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec'],
					items : undefined
					}]
	
	
}